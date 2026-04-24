import { useState } from 'react';
import logoDark from '../assets/images/logo/Logo dark.png';
import logoWight from '../assets/images/logo/Logo wight.png';
import { getContentText, HOME_FALLBACKS } from '../content/homeContent';
import BurgerMenu from './BurgerMenu.js';
import SwitcherTheme from './SwitcherTheme.js';
import '../assets/styles/Header.css';

function Header({ theme, toggleTheme, setIsModalOpen, contentMap, isContentLoading }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const phoneNumber = getContentText(contentMap, 'header-phone', HOME_FALLBACKS.headerPhone);
    const callbackButtonText = getContentText(
        contentMap,
        'header-callback-button',
        HOME_FALLBACKS.headerCallbackButton
    );

    return (
        <header className='header' aria-busy={isContentLoading}>
            <div className='logo-wrap'>
                <img
                    className='logo theme-image-light'
                    src={logoDark}
                    alt='Logo'
                />
                <img
                    className='logo theme-image-dark'
                    src={logoWight}
                    alt='Logo'
                />
            </div>

            <div className='header-center'>
                <p className={theme === 'light' ? 'contact-phone-number' : 'contact-phone-number-dark'}>
                    {phoneNumber}
                </p>

                <button
                    className={theme === 'light' ? 'button' : 'button-dark'}
                    onClick={() => setIsModalOpen(true)}
                >
                    {callbackButtonText}
                </button>
            </div>

            <div className='header-right-side'>
                <SwitcherTheme toggleTheme={toggleTheme} />

                <BurgerMenu
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    theme={theme}
                />
            </div>
        </header>
    );
}

export default Header;
