import { useState, useEffect } from 'react';
import { useFormValidation } from '../context/useFormValidation';
import darkExit from '../assets/images/icons/dark exit.png';
import lightExit from '../assets/images/icons/light exit.png';
import stoneLight from '../assets/images/stone/stone 1.png';
import stoneDark from '../assets/images/stone/stone dark 1.png';
import { getContentText, HOME_FALLBACKS } from '../content/homeContent';
import '../assets/styles/Modal.css';

function Modal({ isOpen, onClose, theme, onSuccess, contentMap }) {
    const [isMounted, setIsMounted] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    const {
        formData,
        errors,
        isCapsLock,
        isSubmitting,
        handleChange,
        checkCapsLock,
        handleSubmit,
        resetForm
    } = useFormValidation({
        source: 'modal',
        onSuccess: () => {
            onSuccess();
            onClose();
        }
    });

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) resetForm();
    }, [isOpen, resetForm]);

    if (!isMounted) return null;

    const title = getContentText(contentMap, 'modal-title', HOME_FALLBACKS.modalTitle);
    const subtitle = getContentText(contentMap, 'modal-subtitle', HOME_FALLBACKS.modalSubtitle);
    const buttonText = getContentText(contentMap, 'modal-button', HOME_FALLBACKS.modalButton);
    const privacyText = getContentText(contentMap, 'modal-privacy', HOME_FALLBACKS.modalPrivacy);

    return (
        <div className={`modal-overlay ${isVisible ? 'visible' : ''}`} onClick={onClose}>
            <div
                className={`modal-container ${theme} ${isVisible ? 'visible' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    className='stone-apper theme-image-light'
                    src={stoneLight}
                    alt=''
                    aria-hidden='true'
                />
                <img
                    className='stone-apper theme-image-dark'
                    src={stoneDark}
                    alt=''
                    aria-hidden='true'
                />
                <img
                    className='stone-bottom theme-image-light'
                    src={stoneLight}
                    alt=''
                    aria-hidden='true'
                />
                <img
                    className='stone-bottom theme-image-dark'
                    src={stoneDark}
                    alt=''
                    aria-hidden='true'
                />

                <button className='close-btn' onClick={onClose}>
                    <img
                        className='theme-image-light'
                        src={darkExit}
                        alt='Close'
                    />
                    <img
                        className='theme-image-dark'
                        src={lightExit}
                        alt='Close'
                    />
                </button>

                <div className='modal-header'>
                    <h1 className={theme === 'light' ? 'text-title' : 'text-title-dark'}>
                        {title}
                    </h1>

                    <h2 className={theme === 'light' ? 'text-subtitle' : 'text-subtitle-dark'}>
                        {subtitle}
                    </h2>
                </div>

                <div className='modal-body'>
                    <form
                        className={theme === 'light' ? 'modal-form' : 'modal-form-dark'}
                        onSubmit={handleSubmit}
                    >
                        <div className='input-group'>
                            <input
                                name='name'
                                className={`${theme === 'light' ? 'form-input' : 'form-input-dark'} ${errors.name ? 'input-error' : ''}`}
                                type='text'
                                placeholder="Ім'я"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={checkCapsLock}
                            />

                            {errors.name ? (
                                <span className='error-label-modal'>
                                    Некоректне ім'я (без цифр та CAPS)
                                </span>
                            ) : isCapsLock ? (
                                <span className='caps-label-modal'>
                                    Увага: Caps Lock увімкнено!
                                </span>
                            ) : null}
                        </div>

                        <div className='input-group'>
                            <input
                                name='phone'
                                className={`${theme === 'light' ? 'form-input' : 'form-input-dark'} ${errors.phone ? 'input-error' : ''}`}
                                type='tel'
                                placeholder='Номер телефону'
                                value={formData.phone}
                                onChange={handleChange}
                            />

                            {errors.phone && (
                                <span className='error-label-modal'>
                                    Тільки цифри (мін. 10 символів)
                                </span>
                            )}
                        </div>

                        <button type='submit' className='submit-btn' disabled={isSubmitting}>
                            {buttonText}
                        </button>
                    </form>

                    <p className='text-privacy'>
                        {privacyText}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Modal;
