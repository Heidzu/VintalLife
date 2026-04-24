import { useEffect, useRef, useState } from 'react';
import stoneLeftDark from '../assets/images/stone/stone dark 4.png';
import stoneRightDark from '../assets/images/stone/stone dark 5.png';
import stoneLeft from '../assets/images/stone/stone 4.png';
import stoneRight from '../assets/images/stone/stone 5.png';
import { getContentText, HOME_FALLBACKS } from '../content/homeContent';
import '../assets/styles/ContactComponent.css';

function ContactComponent({ theme, setIsModalOpen, contentMap, isContentLoading }) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const title1Content = getContentText(
        contentMap,
        'contact-title-line-1',
        HOME_FALLBACKS.contactTitleLine1
    );
    const title2Content = getContentText(
        contentMap,
        'contact-title-line-2',
        HOME_FALLBACKS.contactTitleLine2
    );
    const subtitle1Content = getContentText(
        contentMap,
        'contact-subtitle-line-1',
        HOME_FALLBACKS.contactSubtitleLine1
    );
    const subtitle2Content = getContentText(
        contentMap,
        'contact-subtitle-line-2',
        HOME_FALLBACKS.contactSubtitleLine2
    );
    const addressContent = getContentText(
        contentMap,
        'contact-address',
        HOME_FALLBACKS.contactAddress
    );
    const phoneContent = getContentText(
        contentMap,
        'contact-phone',
        HOME_FALLBACKS.contactPhone
    );
    const workTimeContent = getContentText(
        contentMap,
        'contact-worktime',
        HOME_FALLBACKS.contactWorktime
    );
    const btnContent = getContentText(
        contentMap,
        'contact-button',
        HOME_FALLBACKS.contactButton
    );
    const footer1Content = getContentText(
        contentMap,
        'contact-footer-line-1',
        HOME_FALLBACKS.contactFooterLine1
    );
    const footer2Content = getContentText(
        contentMap,
        'contact-footer-line-2',
        HOME_FALLBACKS.contactFooterLine2
    );
    const mapUrl = getContentText(
        contentMap,
        'contact-map-url',
        HOME_FALLBACKS.contactMapUrl
    );

    return (
        <section className='contact-component' ref={sectionRef} id='contacts' aria-busy={isContentLoading}>
            <div className='contact-component-conteiner'>
                <div className='contact-info-left'>
                    <h6 className='title-contact'>
                        <span dangerouslySetInnerHTML={{ __html: title1Content }} />
                        <span dangerouslySetInnerHTML={{ __html: ` ${title2Content}` }} />
                    </h6>

                    <p className='subtitle-contact'>
                        <span>{subtitle1Content}</span>
                        <span> {subtitle2Content}</span>
                    </p>

                    <div className='contact-text-conteiner'>
                        <p className={`text-1 ${isVisible ? 'visible delay-1' : ''}`}>
                            Адреса:
                        </p>
                        <p className={`text-2 ${isVisible ? 'visible delay-1' : ''}`}>
                            {addressContent}
                        </p>

                        <p className={`text-3 ${isVisible ? 'visible delay-1' : ''}`}>
                            Телефон:
                        </p>
                        <p className={`text-4 ${isVisible ? 'visible delay-1' : ''}`}>
                            {phoneContent}
                        </p>

                        <p className={`text-5 ${isVisible ? 'visible delay-1' : ''}`}>
                            Режим роботи:
                        </p>
                        <p className={`text-6 ${isVisible ? 'visible delay-1' : ''}`}>
                            {workTimeContent}
                        </p>
                    </div>

                    <div className={`btn-wrapper ${isVisible ? 'visible delay-1' : ''}`}>
                        <button
                            className='btn-free-measurement'
                            onClick={() => setIsModalOpen(true)}
                        >
                            {btnContent}
                        </button>
                    </div>

                    <p
                        className={
                            theme === 'light'
                                ? `just-text-contact ${isVisible ? 'visible delay-1' : ''}`
                                : `just-text-contact-dark ${isVisible ? 'visible delay-1' : ''}`
                        }
                    >
                        {footer1Content}
                    </p>

                    <p
                        className={
                            theme === 'light'
                                ? `just-text-two ${isVisible ? 'visible delay-1' : ''}`
                                : `just-text-two-dark ${isVisible ? 'visible delay-1' : ''}`
                        }
                    >
                        {footer2Content}
                    </p>
                </div>

                <div className='map-wrapper'>
                    <iframe
                        className='google-map'
                        src={mapUrl}
                        title='Мапа виробництва'
                        loading='lazy'
                        allowFullScreen
                        referrerPolicy='no-referrer-when-downgrade'
                    />
                </div>
            </div>

            <img
                className='stone-left-contact theme-image-light'
                src={stoneLeft}
                alt=''
                aria-hidden='true'
            />
            <img
                className='stone-left-contact theme-image-dark'
                src={stoneLeftDark}
                alt=''
                aria-hidden='true'
            />

            <img
                className='stone-right-contact theme-image-light'
                src={stoneRight}
                alt=''
                aria-hidden='true'
            />
            <img
                className='stone-right-contact theme-image-dark'
                src={stoneRightDark}
                alt=''
                aria-hidden='true'
            />
        </section>
    );
}

export default ContactComponent;
