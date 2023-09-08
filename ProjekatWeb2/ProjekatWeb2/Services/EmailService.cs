
using MailKit.Net.Smtp;
using MimeKit;
using ProjekatWeb2.Enumerations;
using ProjekatWeb2.Infrastructure.Configurations;
using ProjekatWeb2.Interfaces;

namespace ProjekatWeb2.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailConfiguration _emailConfig;
        public EmailService(EmailConfiguration emailConfig)
        {
            _emailConfig = emailConfig;
        }
        public void SendEmail(string mailReceiver, string statusVerifikacije)
        {
            var emailMessage = CreateEmailMessage(mailReceiver, statusVerifikacije);
            Send(emailMessage);
        }

        private void Send(MimeMessage emailMessage)
        {
            using var smtp = new SmtpClient();
            smtp.Connect(_emailConfig.SmtpServer, _emailConfig.Port, MailKit.Security.SecureSocketOptions.StartTls);
            smtp.Authenticate(_emailConfig.UserName, _emailConfig.Password);
            smtp.Send(emailMessage);
            smtp.Disconnect(true);
        }

        private MimeMessage CreateEmailMessage(string mailReceiver, string statusVerifikacije)
        {

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(MailboxAddress.Parse(_emailConfig.From));
            emailMessage.To.Add(MailboxAddress.Parse(mailReceiver));

            emailMessage.Subject = _emailConfig.Subject;

            string text = "";
            if (statusVerifikacije.Equals(VerifikacijaProdavca.Prihvacen.ToString()))
            {
                text = "Uspešna verifikcija! Vaš profil je sada aktivan.";
            }
            else if (statusVerifikacije.Equals(VerifikacijaProdavca.Odbijen.ToString()))
            {
                text = "Neuspešna verifikacija! Nažalost nemate dalji pristup našem sajtu kao prodavac.";
            }

            var bodyBuilder = new BodyBuilder { HtmlBody = $"<h2 style='color:red;'>{text}</h2>" };
            emailMessage.Body = bodyBuilder.ToMessageBody();


            return emailMessage;
        }
    }
}
