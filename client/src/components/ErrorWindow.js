import { useEffect } from 'react';
import stone from '../assets/images/stone/stone 1.png';
import stoneDark from '../assets/images/stone/stone dark 1.png';
import elipse from '../assets/images/icons/elipse-error.png';
import error from '../assets/images/icons/error.png';
import { getContentText, HOME_FALLBACKS } from '../content/homeContent';
import '../assets/styles/ErrorWindow.css';

function ErrorWindow({ theme, isOpen, onClose, contentMap }) {
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [isOpen, onClose]);

    const line1 = getContentText(contentMap, 'error-line-1', HOME_FALLBACKS.errorLine1);
    const line2 = getContentText(contentMap, 'error-line-2', HOME_FALLBACKS.errorLine2);
    const line3 = getContentText(contentMap, 'error-line-3', HOME_FALLBACKS.errorLine3);
    const buttonText = getContentText(contentMap, 'error-button', HOME_FALLBACKS.errorButton);

    return (
        <div className={`window-error-wrapper ${isOpen ? 'active' : ''}`}>
            <div className={theme === 'light' ? 'window-error' : 'window-error-dark'}>
                <img
                    className='stone-right-window-error theme-image-light'
                    src={stone}
                    alt=''
                    aria-hidden='true'
                />
                <img
                    className='stone-right-window-error theme-image-dark'
                    src={stoneDark}
                    alt=''
                    aria-hidden='true'
                />

                <div className='conteiner-window-error'>
                    <div className='error-icon-conteiner'>
                        <img className='elipse-error' src={elipse} alt='' aria-hidden='true' />
                        <img className='error-icon' src={error} alt='Помилка' />
                    </div>

                    <div className='text-window-error'>
                        <p>{line1}</p>
                        <p>{line2}</p>
                        <p>{line3}</p>
                    </div>

                    <button className='btn-window-error' onClick={onClose}>
                        {buttonText}
                    </button>
                </div>

                <img
                    className='stone-left-window-error theme-image-light'
                    src={stone}
                    alt=''
                    aria-hidden='true'
                />
                <img
                    className='stone-left-window-error theme-image-dark'
                    src={stoneDark}
                    alt=''
                    aria-hidden='true'
                />
            </div>
        </div>
    );
}

export default ErrorWindow;