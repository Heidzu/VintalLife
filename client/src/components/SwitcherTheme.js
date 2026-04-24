import wightMod from '../assets/images/icons/swicher.png';
import darkMod from '../assets/images/icons/switcher wight.png';
import '../assets/styles/Header.css';

function SwitcherTheme({ toggleTheme }) {
  return (
    <button
      type='button'
      className='switcher-button'
      onClick={toggleTheme}
      aria-label='Змінити тему'
    >
      <img
        className='switcher theme-image-light'
        src={wightMod}
        alt=''
        aria-hidden='true'
      />
      <img
        className='switcher theme-image-dark'
        src={darkMod}
        alt=''
        aria-hidden='true'
      />
    </button>
  );
}

export default SwitcherTheme;
