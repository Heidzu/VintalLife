import { useEffect, useRef, useState } from 'react';
import rectangleDark from '../assets/images/icons/Rectangle 1.png';
import rectangleLight from '../assets/images/icons/Rectangle 1 wight.png';
import telegram from '../assets/images/icons/Telegram.png';
import telegramDark from '../assets/images/icons/Telegram wight.png';
import viber from '../assets/images/icons/Viber.png';
import viberDark from '../assets/images/icons/Viber wight.png';
import whatsapp from '../assets/images/icons/Whatsapp.png';
import whatsappDark from '../assets/images/icons/Whatsapp wight.png';
import kitchenFirst from '../assets/images/photo-kitchen/1.jpg';
import kitchenSecond from '../assets/images/photo-kitchen/2.jpg';
import stoneDark from '../assets/images/stone/stone dark 1.png';
import stoneLight from '../assets/images/stone/stone 1.png';
import {
    getContentImage,
    getContentImageAlt,
    getContentText,
    HOME_FALLBACKS
} from '../content/homeContent';
import Header from './Header.js';
import '../assets/styles/FirstScreen.css';
import '../assets/styles/Header.css';

function FirstScreen({
    theme,
    toggleTheme,
    setIsModalOpen,
    contentMap,
    isContentLoading
}) {
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

    const catalogNote = getContentText(
        contentMap,
        'first-screen-catalog-note',
        HOME_FALLBACKS.firstScreenCatalogNote
    );
    const catalogLinkText = getContentText(
        contentMap,
        'first-screen-catalog-link',
        HOME_FALLBACKS.firstScreenCatalogLink
    );
    const titleLine1 = getContentText(
        contentMap,
        'first-screen-title-line-1',
        HOME_FALLBACKS.firstScreenTitleLine1
    );
    const titleLine2 = getContentText(
        contentMap,
        'first-screen-title-line-2',
        HOME_FALLBACKS.firstScreenTitleLine2
    );
    const titleLine3 = getContentText(
        contentMap,
        'first-screen-title-line-3',
        HOME_FALLBACKS.firstScreenTitleLine3
    );
    const primaryButtonText = getContentText(
        contentMap,
        'first-screen-primary-button',
        HOME_FALLBACKS.firstScreenPrimaryButton
    );
    const secondaryButtonText = getContentText(
        contentMap,
        'first-screen-secondary-button',
        HOME_FALLBACKS.firstScreenSecondaryButton
    );
    const primaryImage = getContentImage(
        contentMap,
        'first-screen-image-primary',
        kitchenFirst
    );
    const secondaryImage = getContentImage(
        contentMap,
        'first-screen-image-secondary',
        kitchenSecond
    );
    const primaryImageAlt = getContentImageAlt(
        contentMap,
        'first-screen-image-primary',
        'Кухня'
    );
    const secondaryImageAlt = getContentImageAlt(
        contentMap,
        'first-screen-image-secondary',
        'Кухня'
    );

    return (
        <div className={`first-screen ${isVisible ? 'visible' : ''}`} ref={sectionRef} aria-busy={isContentLoading}>
            <div className='first-screen-conteiner'>
                <Header
                    toggleTheme={toggleTheme}
                    theme={theme}
                    setIsModalOpen={setIsModalOpen}
                    contentMap={contentMap}
                    isContentLoading={isContentLoading}
                />

                <div className='center-first-screen-conteiner'>
                    <div className='left-side'>
                        <img
                            className='kitchen-second'
                            src={secondaryImage}
                            alt={secondaryImageAlt}
                        />
                        <div className='text-catalog'>
                            <p>
                                {catalogNote}{' '}
                                <a
                                    className={theme === 'light' ? 'ref-catalog' : 'ref-catalog-dark'}
                                    href='#catalog'
                                >
                                    {catalogLinkText}
                                    <span className='theme-inline-icon'>
                                        <img
                                            className='theme-image-light'
                                            src={rectangleDark}
                                            alt='stone'
                                        />
                                        <img
                                            className='theme-image-dark'
                                            src={rectangleLight}
                                            alt='stone'
                                        />
                                    </span>
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className='title-conteiner-first-screen'>
                        <h1 className={theme === 'light' ? 'title-first-screen' : 'title-first-screen-dark'}>
                            <span dangerouslySetInnerHTML={{ __html: titleLine1 }} />
                            <span 
                                className={theme === 'light' ? 'sub-1' : 'sub-dark-1'}
                                dangerouslySetInnerHTML={{ __html: titleLine2 }}
                            />
                            <span 
                                className={theme === 'light' ? 'sub-2' : 'sub-dark-2'}
                                dangerouslySetInnerHTML={{ __html: titleLine3 }}
                            />
                        </h1>
                        <div className='btn-conteiner'>
                            <button
                                className='measure-button'
                                onClick={() => setIsModalOpen(true)}
                            >
                                {primaryButtonText}
                            </button>
                            <button
                                className='cost-button'
                                onClick={() => setIsModalOpen(true)}
                            >
                                {secondaryButtonText}
                            </button>
                        </div>
                        <div className='conteiner-social-networks'>
                            <a
                                className='Telegram'
                                href={HOME_FALLBACKS.socialLinks.telegram}
                            >
                                <img
                                    className='theme-image-light'
                                    src={telegram}
                                    alt='Telegram'
                                />
                                <img
                                    className='theme-image-dark'
                                    src={telegramDark}
                                    alt='Telegram'
                                />
                            </a>
                            <a
                                className='Whatsapp'
                                href={HOME_FALLBACKS.socialLinks.whatsapp}
                            >
                                <img
                                    className='theme-image-light'
                                    src={whatsapp}
                                    alt='Whatsapp'
                                />
                                <img
                                    className='theme-image-dark'
                                    src={whatsappDark}
                                    alt='Whatsapp'
                                />
                            </a>
                            <a
                                className='Viber'
                                href={HOME_FALLBACKS.socialLinks.viber}
                            >
                                <img
                                    className='theme-image-light'
                                    src={viber}
                                    alt='Viber'
                                />
                                <img
                                    className='theme-image-dark'
                                    src={viberDark}
                                    alt='Viber'
                                />
                            </a>
                        </div>
                    </div>
                    <div className='kitchen-first-conteiner'>
                        <img
                            className='kitchen-first-img'
                            src={primaryImage}
                            alt={primaryImageAlt}
                        />
                    </div>
                </div>
            </div>
            <img
                className='first-stone theme-image-light'
                src={stoneLight}
                alt='images'
                fetchPriority='high'
            />
            <img
                className='first-stone theme-image-dark'
                src={stoneDark}
                alt='images'
                fetchPriority='high'
            />
            <img
                className='second-stone theme-image-light'
                src={stoneLight}
                alt='images'
                fetchPriority='high'
            />
            <img
                className='second-stone theme-image-dark'
                src={stoneDark}
                alt='images'
                fetchPriority='high'
            />
        </div>
    );
}

export default FirstScreen;
