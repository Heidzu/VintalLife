import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ModalCitchenCatalog from './ModalCitchenCatalog.js';
import { getContentText, HOME_FALLBACKS } from '../content/homeContent';
import { useContentByType } from '../hooks/useContent';

import 'swiper/css';
import 'swiper/css/navigation';
import '../assets/styles/SliderCatalog.css';

import arrowLeft from '../assets/images/icons/Arrow left.png';
import arrowRight from '../assets/images/icons/Arrow right.png';
import arrowLeftLight from '../assets/images/icons/Arrow left wight.png';
import arrowRightLight from '../assets/images/icons/Arrow right wight.png';

import stoneRightLight from '../assets/images/stone/stone 2.png';
import stoneRightDark from '../assets/images/stone/stone dark 2.png';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

function SliderCatalog({ theme, contentMap }) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const [isModalCithenOpen, setIsModalCithenOpen] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [stylePhotos, setStylePhotos] = useState({});

    const { data: dynamicItems } = useContentByType('catalog', { language: 'uk' });

    const catalogCards = useMemo(() => {
        return (dynamicItems || [])
            .filter(item => item.key.startsWith('catalog-item-'))
            .sort((a, b) => (a.position || 0) - (b.position || 0));
    }, [dynamicItems]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (catalogCards.length === 0) return;

        const fetchPhotosForStyles = async () => {
            const results = await Promise.all(
                catalogCards.map(async (card) => {
                    const styleSlug = card.metadata?.style;
                    if (!styleSlug) return null;

                    try {
                        const response = await fetch(`${API_BASE}/photos/style/${styleSlug}`);
                        const result = await response.json();

                        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                            return [styleSlug, result.data];
                        }
                    } catch (error) {
                        console.error(`Error fetching photos for ${styleSlug}:`, error);
                    }

                    return null;
                })
            );

            const photosData = results.reduce((accumulator, item) => {
                if (!item) return accumulator;
                const [style, photos] = item;
                accumulator[style] = photos;
                return accumulator;
            }, {});

            setStylePhotos(photosData);
        };

        fetchPhotosForStyles();
    }, [catalogCards]);

    const resolveImageUrl = useCallback((url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        // If it starts with static/ it's likely a React asset from DB, so we add a slash
        if (url.startsWith('static/')) return `/${url}`;
        // Otherwise, assume it's already a correct path from the API
        return url;
    }, []);

    const openModal = useCallback((card) => {
        const styleSlug = card.metadata?.style;
        const imageUrl = resolveImageUrl(card.imageUrl);

        const styleData = {
            id: card._id,
            style: styleSlug,
            title: card.title,
            coverImage: imageUrl,
            gallery: stylePhotos[styleSlug]?.map(p => p.fileUrl) || [imageUrl]
        };
        setSelectedStyle(styleData);
        setIsModalCithenOpen(true);
        document.body.style.overflow = 'hidden';
    }, [stylePhotos, resolveImageUrl]);

    const closeModal = useCallback(() => {
        setIsModalCithenOpen(false);
        setSelectedStyle(null);
        document.body.style.overflow = 'auto';
    }, []);

    const title = getContentText(contentMap, 'catalog-title', HOME_FALLBACKS.catalogTitle);
    const buttonText = getContentText(contentMap, 'catalog-button-text', HOME_FALLBACKS.catalogButtonText);

    return (
        <section className='kitchen-catalog' ref={sectionRef} id='catalog' style={{ minHeight: '400px' }}>
            <img
                className='stone-right-one theme-image-light'
                src={stoneRightLight}
                alt=''
                aria-hidden='true'
            />
            <img
                className='stone-right-one theme-image-dark'
                src={stoneRightDark}
                alt=''
                aria-hidden='true'
            />

            <div className='kitchen-catalog-conteiner'>
                <h2 className='catalog-title'>
                    {title}
                </h2>

                <div className='slider-wrapper'>
                    <button className={`prev-arrow ${isVisible ? 'visible delay-3' : ''}`} aria-label='Попередній слайд'>
                        <img
                            className={theme === 'light' ? 'theme-image-light on-vinsble' : 'theme-image-light on-hiden'}
                            src={arrowLeft}
                            alt=''
                            aria-hidden='true'
                        />
                        <img
                            className={theme === 'dark' ? 'theme-image-dark on-vinsble' : 'theme-image-dark on-hiden'}
                            src={arrowLeftLight}
                            alt=''
                            aria-hidden='true'
                        />
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        slidesPerView={3}
                        navigation={{
                            nextEl: '.next-arrow',
                            prevEl: '.prev-arrow'
                        }}
                        loop={catalogCards.length >= 3}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 15
                            },
                            560: {
                                slidesPerView: 1,
                                spaceBetween: 20
                            },
                            769: {
                                slidesPerView: 2,
                                spaceBetween: 30
                            },
                            1201: {
                                slidesPerView: 3,
                                spaceBetween: 40
                            }
                        }}
                    >
                        {catalogCards.map((card) => {
                            const imageUrl = resolveImageUrl(card.imageUrl);
                            return (
                                <SwiperSlide key={card._id}>
                                    <div className='style-card'>
                                        <img
                                            src={imageUrl}
                                            alt={card.title}
                                            className='card-img'
                                            loading="lazy"
                                        />

                                        <div className='card-overlay'>
                                            <div className='overlay-content'>
                                                <p className='title-card' dangerouslySetInnerHTML={{ __html: card.title }} />

                                                <div className='card-extra-info'>
                                                    <p className='price'>{card.content}</p>
                                                    <button 
                                                        className='catalog-link' 
                                                        style={{background: 'transparent', border: 'none', cursor: 'pointer'}}
                                                        onClick={() => openModal(card)}
                                                    >
                                                        {buttonText}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    <button className={`next-arrow ${isVisible ? 'visible delay-3' : ''}`} aria-label='Наступний слайд'>
                        <img
                            className={theme === 'light' ? 'theme-image-light on-vinsble' : 'theme-image-light on-hiden'}
                            src={arrowRight}
                            alt=''
                            aria-hidden='true'
                        />
                        <img
                            className={theme === 'dark' ? 'theme-image-dark on-vinsble' : 'theme-image-dark on-hiden'}
                            src={arrowRightLight}
                            alt=''
                            aria-hidden='true'
                        />
                    </button>
                </div>
            </div>

            <ModalCitchenCatalog 
                isOpen={isModalCithenOpen} 
                onClose={closeModal} 
                styleData={selectedStyle} 
                theme={theme} 
            />
        </section>
    );
}

export default React.memo(SliderCatalog);
