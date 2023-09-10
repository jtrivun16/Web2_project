using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ProjekatWeb2.Infrastructure;
using ProjekatWeb2.Infrastructure.Configurations;
using ProjekatWeb2.Interfaces;
using ProjekatWeb2.Mapping;
using ProjekatWeb2.Repository;
using ProjekatWeb2.Repository.Interfaces;
using ProjekatWeb2.Services;
using System.Text;
using System.Text.Json.Serialization;

namespace ProjekatWeb2
{
    public class Startup
    {
        private readonly string _cors = "cors";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddHttpContextAccessor();
            services.AddSwaggerGen(c =>
            {
               c.SwaggerDoc("v1", new OpenApiInfo { Title = "ProjekatWeb2", Version = "v1" });
                //Ovo dodajemo kako bi mogli da unesemo token u swagger prilikom testiranja
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "bearer"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });

            //tokeni
            //Dodajemo semu autentifikacije i podesavamo da se radi o JWT beareru
            services.AddAuthentication(opt => {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidIssuer = Configuration["ValidIssuer"],
                    ValidateIssuer = true,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero, //ovo provjerava da li je isteklo vazenje tokena
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["SecretKey"]))
                };
            });

            //mehanizam kojim server specificira kojim domenima dozvoljava da ga kontaktiraju
            services.AddCors(options =>
            {
                var reactApp = Configuration["ReactApp"];
                options.AddPolicy(name: _cors, builder =>
                {
                    builder.WithOrigins(reactApp, "https://localhost:3000", "https://localhost:3001", "http://localhost:3001")
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials();
                });
            });


            //registracija db contexta u kontejneru zavisnosti, njegov zivotni vek je Scoped
            services.AddDbContext<OnlineProdavnicaDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("OnlineProdavnicaDB")));

            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IKorisnikRepozitorijum, KorisnikRepozitorijum>();
            services.AddScoped<IKorisnikService, KorisnikService>();
            services.AddScoped<IArtikalRepozitorijum, ArtikalRepozitorijum>();
            services.AddScoped<IArtikalService, ArtikalService>();
            services.AddScoped<IPorudzbinaRepozitorijum, PorudzbinaRepozitorijum>();
            services.AddScoped<IPorudzbinaService, PorudzbinaService>();
            services.AddScoped<IElementPorudzbineRepozitorijum, ElementPorudzbineRepozitorijum>();
            services.AddScoped<IEmailService, EmailService>();

            //dodavanje za konverziju enumeracija, sa fronta saljem enumeraciju kao string, on je konvertuje ispravno
            services.AddControllers().AddJsonOptions(x =>
            {
                x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                x.JsonSerializerOptions.IgnoreNullValues = true;
            });

            //Registracija mapera u kontejneru, zivotni vek singleton
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });

            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);

            var emailConfig = Configuration
                .GetSection("EmailConfiguration")
                .Get<EmailConfiguration>();
            services.AddSingleton(emailConfig);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProjekatWeb2 v1"));
            }

            app.UseHttpsRedirection();

            app.UseCors(_cors);

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

    }
}

