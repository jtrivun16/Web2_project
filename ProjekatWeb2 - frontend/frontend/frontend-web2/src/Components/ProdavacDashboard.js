import React from "react";
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import HourglassTopTwoToneIcon from '@mui/icons-material/HourglassTopTwoTone';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';


const ProdavacDashboard = ({statusVerifikacije}) => {
    return (
        <div>
            {statusVerifikacije === 'UProcesu' && 
                <>
                    <h2 className="naslov">
                        <HourglassTopTwoToneIcon/>
                        Vaš zahtjev je u procesu
                        </h2>
                        <div className="sub header" style={{ marginTop:'0px' }}>
                            Uskoro ćete dobiti obavještenje o rezultatu verifikacije na Vaš email.
                        </div>
                    
                </>
            }
            {statusVerifikacije === 'Odbijen' &&
                <>
                   <h2 className="ui red center aligned icon header" style={{ marginTop:'0px' }}>
                        <HighlightOffTwoToneIcon/>
                        Vaš zahtjev je odbijen. Niste u mogućnosti da nastavite koristi naš sajt.
                    </h2> 
                </>
            }
            {statusVerifikacije === 'Prihvacen' && 
                <>
                <h2 className="ui green center aligned icon header"  style={{ marginTop:'0px' }}>
                        <VerifiedUserTwoToneIcon/>
                        Uspješno ste prijavljeni na naš sajt u ulozi prodavca.
                    </h2> 
                    <div style={{ marginTop:'0px' }}>
                        
                    </div>
                </>
            }

            
        </div>
        
    );
}

export default ProdavacDashboard;