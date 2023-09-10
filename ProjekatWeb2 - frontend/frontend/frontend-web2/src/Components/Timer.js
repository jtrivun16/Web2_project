import React from 'react';
import {useCountdown} from './useCountdown';

const Timer = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <div>Porudžbina je dostavljena</div>; 
  } else {
    return (
        <div>
            {days} dana {hours} h {minutes} min {seconds} s
        </div>
    );
  }
};

export default Timer;