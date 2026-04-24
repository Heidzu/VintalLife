import { useState, useRef, useEffect } from 'react';
import { useFormValidation } from '../context/useFormValidation';
import { getContentText, getContentImage, HOME_FALLBACKS } from '../content/homeContent';

import stoneRight from '../assets/images/stone/stone 3.png';
import stoneRightDark from '../assets/images/stone/stone dark 3.png';
import kitchenFirstDefault from '../assets/images/photo-kitchen/11.png';
import kitchenSecondDefault from '../assets/images/photo-kitchen/11.jpg';
import kitchenThirdDefault from '../assets/images/photo-kitchen/12.png';

import '../assets/styles/InstallmentComponent.css';

function InstallmentComponent({ theme, setIsSuccessOpen, setIsErrorOpen, contentMap }) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const {
        formData,
        errors,
        isCapsLock,
        isSubmitting,
        handleChange,
        checkCapsLock,
        handleSubmit
    } = useFormValidation({
        source: 'installment',
        onSuccess: () => setIsSuccessOpen(true),
        onError: () => setIsErrorOpen(true)
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.25 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const title = getContentText(contentMap, 'installment-title', HOME_FALLBACKS.installmentTitle);
    const subtitle = getContentText(contentMap, 'installment-subtitle', HOME_FALLBACKS.installmentSubtitle);
    const buttonText = getContentText(contentMap, 'installment-button', HOME_FALLBACKS.installmentButton);
    const privacyText = getContentText(contentMap, 'installment-privacy', HOME_FALLBACKS.installmentPrivacy);
    const footerText = getContentText(contentMap, 'installment-footer-text', HOME_FALLBACKS.installmentFooterText);

    const image1 = getContentImage(contentMap, 'installment-image-1', kitchenFirstDefault);
    const image2 = getContentImage(contentMap, 'installment-image-2', kitchenSecondDefault);
    const image3 = getContentImage(contentMap, 'installment-image-3', kitchenThirdDefault);

    return (
        <section className='installment-component' ref={sectionRef} id='installment'>
            <div className='installment-component-conteiner'>
                <div className='container-installment-left-part'>
                    <h5 className={`title-installment ${isVisible ? 'visible delay-1' : ''}`}>
                        {title}
                    </h5>

                    <p className={`subtitle-installment ${isVisible ? 'visible delay-2' : ''}`}>
                        {subtitle}
                    </p>

                    <form
                        className={`${theme === 'light' ? 'form-installment' : 'form-installment-dark'} ${isVisible ? 'visible delay-3' : ''}`}
                        onSubmit={handleSubmit}
                    >
                        <div className='conteiner-input-instalment'>
                            <input
                                name='name'
                                className={`form-input-installment ${errors.name ? 'input-error' : ''}`}
                                type='text'
                                placeholder="Ім&apos;я"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={checkCapsLock}
                            />
                            {errors.name ? (
                                <span className='error-label-instalment'>
                                    Некоректне ім&apos;я (без цифр та CAPS)
                                </span>
                            ) : isCapsLock ? (
                                <span className='caps-label-instalment'>
                                    Увага: Caps Lock увімкнено!
                                </span>
                            ) : null}
                        </div>

                        <div className='conteiner-input-instalment'>
                            <input
                                name='phone'
                                className={`form-input-installment ${errors.phone ? 'input-error' : ''}`}
                                type='tel'
                                placeholder='Номер телефону'
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && (
                                <span className='error-label-instalment'>
                                    Тільки цифри (мін. 10 символів)
                                </span>
                            )}
                        </div>

                        <button type='submit' className='btn-form-installment' disabled={isSubmitting}>
                            {buttonText}
                        </button>
                    </form>

                    <p className={`privacy-installment ${isVisible ? 'visible delay-4' : ''}`}>
                        {privacyText}
                    </p>

                    <p
                        className={
                            theme === 'light'
                                ? `just-text ${isVisible ? 'visible delay-5' : ''}`
                                : `just-text-dark ${isVisible ? 'visible delay-5' : ''}`
                        }
                    >
                        {footerText}
                    </p>
                </div>

                <div className='conteiner-images-kitchen'>
                    <div className='left-kitchen-column'>
                        <img
                            className={`citchen-1 ${isVisible ? 'visible delay-1' : ''}`}
                            src={image1}
                            alt="kitchen-1"
                        />
                        <img
                            className={`citchen-2 ${isVisible ? 'visible delay-2' : ''}`}
                            src={image2}
                            alt="kitchen-2"
                        />
                    </div>

                    <img
                        className={`citchen-3 ${isVisible ? 'visible delay-3' : ''}`}
                        src={image3}
                        alt="kitchen-3"
                    />
                </div>
            </div>

            <img
                className='stone-right theme-image-light'
                src={stoneRight}
                alt=''
                aria-hidden='true'
            />
            <img
                className='stone-right theme-image-dark'
                src={stoneRightDark}
                alt=''
                aria-hidden='true'
            />
        </section>
    );
}

export default InstallmentComponent;
