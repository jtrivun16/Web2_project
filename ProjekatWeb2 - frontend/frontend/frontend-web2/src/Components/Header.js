import '../App.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';


const Header = ({isAuth, tipKorisnika, statusVerifikacije, handleLogout}) => {

    const active = (isActive) =>{
        if(isActive)
            return "item active"
        else
            return "item"
    }

    const nav=useNavigate();

    const goToRegistration=()=>{
        nav('registration');
    }

    return (
        <div style={{height:'50px',width:'100%', backgroundColor: '#ededed', borderBottom:'3px solid #7393B3',  borderTop:'3px solid #7393B3'}}>
            <ButtonGroup  
                 spacing="0.5rem" aria-label="spacing button group" sx={{m: 0.5}}>
            {isAuth ? null :
                <Button
                    //className={({isActive}) => active(isActive)}
                    className='headerButton'
                    sx={{m: 1}}
                    variant='contained'
                    onClick={()=>nav('login')}
                >
                    Log in
                </Button>  
            }     
            {isAuth ? null :      
                <Button
                    //className={({isActive}) => active(isActive)}
                    variant='contained'
                    className='headerButton'
                    sx={{m: 1}}
                    onClick={goToRegistration}
                >
                    Registration
                </Button>
            }
            
            {isAuth && tipKorisnika === "Kupac" ? 
                <Button
                    //className={({isActive}) => active(isActive)}
                    variant='contained'
                    className='headerButton'
                    onClick={()=>nav('kupacDashboard')}
                >
                    Kupac Dashboard
                </Button>
                : null
            }

            {isAuth && statusVerifikacije === 'Prihvacen'?
                <Button
                    variant='contained'
                    className='headerButton'
                    onClick={()=>nav('profil')}
                >
                    Profil
                </Button> 
                : null
            }


            {isAuth && tipKorisnika === 'Prodavac' ? 
            <Button 
                variant='contained'
                className='headerButton'
                onClick={()=>nav('prodavacDashboard')}
            >
                Prodavac dashboard
            </Button> 
            : null}

            {isAuth && tipKorisnika === 'Prodavac' && statusVerifikacije === 'Prihvacen' ?
             <Button 
                variant='contained'
                className='headerButton'
                onClick={()=>nav('prodavacNoviArtikal')}
             >
               Dodaj artikal
            </Button> 
            : null
            }

            {isAuth && tipKorisnika === 'Prodavac' && statusVerifikacije === 'Prihvacen' ?
            <Button 
                variant='contained'
                className='headerButton'
                onClick={()=>nav('prodavacSviArtikli')}         
                >
                    Moji artikli
            </Button>
             : null}


            {isAuth && tipKorisnika === 'Prodavac' && statusVerifikacije === 'Prihvacen' ?
             <Button 
                variant='contained'
                className='headerButton'
                onClick={()=>nav('prodavacNovePorudzbine')}
             >
                Nove porudžbine
            </Button> 
            : null}

            {isAuth && tipKorisnika === 'Prodavac' && statusVerifikacije === 'Prihvacen' ?
             <Button 
             variant='contained'
             className='headerButton'
             onClick={()=>nav('prodavacPrethodnePorudzbine')}         
             >
                Prethodne porudžbine
            </Button> 
            : null}


            {isAuth && tipKorisnika === 'Administrator'  ? 
            <Button 
                variant='contained'
                className='headerButton'
                onClick={()=>nav('administratorDashboard')}
            >
                Admin dashboard
            </Button> 
            : null}

            {isAuth && tipKorisnika === 'Administrator' ? 
            <Button 
                variant='contained'
                className='headerButton'
                onClick={()=>nav('verifikacija')}
            >
                Verifikacija prodavaca
            </Button> 
            : null}

            {isAuth && tipKorisnika === 'Administrator' ? 
            <Button 
                variant='contained'
                className='headerButton'
                onClick={()=>nav('svePorudzbineAdmin')}
            >
                Sve porudzbine
            </Button> 
            : null}

            {isAuth ? 
            <Button
                variant='contained'
                className='headerButton'
                onClick={handleLogout} 
                href="/"
                >
                    Logout
             </Button> 
             : null
             }
        </ButtonGroup>
        </div>
    )
}
export default Header;