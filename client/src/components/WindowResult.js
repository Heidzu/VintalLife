import { useEffect } from 'react';
import stone from '../assets/images/stone/stone 1.png';
import stoneDark from '../assets/images/stone/stone dark 1.png';
import elipse from '../assets/images/icons/elipse-check-mark.png';
import checkMark from '../assets/images/icons/check-mark.png';
import { getContentText, HOME_FALLBACKS } from '../content/homeContent';
import '../assets/styles/WindowResult.css';

function WindowResult({ theme, isOpen, onClose, contentMap }) {
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [isOpen, onClose]);

    const line1 = getContentText(contentMap, 'success-line-1', HOME_FALLBACKS.successLine1);
    const line2 = getContentText(contentMap, 'success-line-2', HOME_FALLBACKS.successLine2);
    const line3 = getContentText(contentMap, 'success-line-3', HOME_FALLBACKS.successLine3);
    const buttonText = getContentText(contentMap, 'success-button', HOME_FALLBACKS.successButton);

    return (
        <div className={`window-result-wrapper ${isOpen ? 'active' : ''}`}>
            <div className={theme === 'light' ? 'window-result' : 'window-result-dark'}>
                <img
                    className='stone-right-window-result theme-image-light'
                    src={stone}
                    alt=''
                    aria-hidden='true'
                />
                <img
                    className='stone-right-window-result theme-image-dark'
                    src={stoneDark}
                    alt=''
                    aria-hidden='true'
                />

                <div className='conteiner-window-result'>
                    <div className='check-mark-conteiner'>
                        <img
                            className='elipse-check-mark'
                            src={elipse}
                            alt=''
                            aria-hidden='true'
                        />
                        <img
                            className='check-mark'
                            src={checkMark}
                            alt='Успішно'
                        />
                    </div>

                    <div className='text-window-result'>
                        <p>{line1}</p>
                        <p>{line2}</p>
                        <p>{line3}</p>
                    </div>

                    <button className='btn-window-result' onClick={onClose}>
                        {buttonText}
                    </button>
                </div>

                <img
                    className='stone-left-window-result theme-image-light'
                    src={stone}
                    alt=''
                    aria-hidden='true'
                />
                <img
                    className='stone-left-window-result theme-image-dark'
                    src={stoneDark}
                    alt=''
                    aria-hidden='true'
                />
            </div>
        </div>
    );
}

export default WindowResult;
