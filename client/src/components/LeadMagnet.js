import { useFormValidation } from '../context/useFormValidation.js';
import { useState, useRef, useEffect } from 'react';
import kitchenNineDefault from '../assets/images/photo-kitchen/9.png';
import { getContentText, getContentImage, HOME_FALLBACKS } from '../content/homeContent';
import '../assets/styles/LeadMagnet.css';

function LeadMagnet({ setIsSuccessOpen, setIsErrorOpen, contentMap }) {
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
        source: 'lead-magnet',
        onSuccess: () => setIsSuccessOpen(true),
        onError: () => setIsErrorOpen(true)
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.25 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);

        return () => observer.disconnect();
    }, []);

    const title = getContentText(contentMap, 'lead-magnet-title', HOME_FALLBACKS.leadMagnetTitle);
    const subtitle = getContentText(contentMap, 'lead-magnet-subtitle', HOME_FALLBACKS.leadMagnetSubtitle);
    const buttonText = getContentText(contentMap, 'lead-magnet-button', HOME_FALLBACKS.leadMagnetButton);
    const privacyText = getContentText(contentMap, 'lead-magnet-privacy', HOME_FALLBACKS.leadMagnetPrivacy);
    const mainImage = getContentImage(contentMap, 'lead-magnet-image', kitchenNineDefault);

    return (
        <section className="lead-magnet" ref={sectionRef}>
            <img
                className="lead-magnet-image"
                src={mainImage}
                alt=""
                aria-hidden="true"
            />

            <div className="lead-magnet-container">
                <h3 className={`lead-magnet-title ${isVisible ? 'visible delay-1' : ''}`}>
                    {title}
                </h3>

                <p className={`lead-magnet-subtitle ${isVisible ? 'visible delay-2' : ''}`}>
                    {subtitle}
                </p>

                <form
                    className={`lead-magnet-container-form ${isVisible ? 'visible delay-3' : ''}`}
                    onSubmit={handleSubmit}
                >
                    <div className="input-conteiner-lead-magnet">
                        <input
                            name="name"
                            className={`lead-magnet-form-input ${errors.name ? 'input-error' : ''}`}
                            type="text"
                            placeholder="Ваше ім'я"
                            value={formData.name}
                            onChange={handleChange}
                            onKeyDown={checkCapsLock}
                        />

                        {errors.name ? (
                            <span className="error-label-lead-magnet">
                                Некоректне ім'я (без цифр та CAPS)
                            </span>
                        ) : isCapsLock ? (
                            <span className="caps-label-lead-magnet">
                                Увага: Caps Lock увімкнено!
                            </span>
                        ) : null}
                    </div>

                    <div className="input-conteiner-lead-magnet">
                        <input
                            name="phone"
                            className={`lead-magnet-form-input ${errors.phone ? 'input-error' : ''}`}
                            type="tel"
                            placeholder="Номер телефону"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                        {errors.phone && (
                            <span className="error-label-lead-magnet">
                                Тільки цифри (мін. 10 символів)
                            </span>
                        )}
                    </div>

                    <div className="btn-conteiner-lead-magnet">
                        <button type="submit" className="submit-button-lead-magnet" disabled={isSubmitting}>
                            {buttonText}
                        </button>

                        <p className={`lead-magnet-text-pravacy ${isVisible ? 'visible delay-3' : ''}`}>
                            {privacyText}
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default LeadMagnet;
