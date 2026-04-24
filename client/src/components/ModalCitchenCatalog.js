import React, { useState, useEffect } from 'react';
import '../assets/styles/ModalCitchenCatalog.css';
import lightExit from "../assets/images/icons/light exit.png";
import DarkExit from "../assets/images/icons/dark exit.png";

function SkeletonImage() {
    return (
        <div className="gallery-item skeleton">
            <div className="skeleton-loader"></div>
        </div>
    );
}

function ModalCitchenCatalog({ isOpen, onClose, styleData, theme }) {
    const [isMounted, setIsMounted] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastStyleData, setLastStyleData] = useState(styleData);

    useEffect(() => {
        if (isOpen) {
            setLastStyleData(styleData);
            setIsMounted(true);
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, styleData]);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
        }
    }, [isOpen, lastStyleData?.gallery?.length]);

    useEffect(() => {
        if (lastStyleData?.gallery?.length > 0) {
            const loadCount = lastStyleData.gallery.length;
            let loaded = 0;
            lastStyleData.gallery.forEach((_, index) => {
                const img = new Image();
                img.onload = () => {
                    loaded++;
                    if (loaded === loadCount) setIsLoading(false);
                };
                img.onerror = () => {
                    loaded++;
                    if (loaded === loadCount) setIsLoading(false);
                };
                img.src = lastStyleData.gallery[index];
            });
        }
    }, [lastStyleData?.gallery]);

    if (!isMounted || !lastStyleData) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };

    return (
        <div className={`modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleOverlayClick}>
            <div className={`modal-content ${theme === 'dark' ? 'dark-modal' : ''} ${isVisible ? 'visible' : ''}`}>

                <button className="close-btn-catalog" onClick={onClose} aria-label="Закрити">
                    <img 
                        src={theme === 'dark' ? lightExit : DarkExit} 
                        alt="Закрити" 
                    />
                </button>
                <h2 
                    className="modal-title" 
                    dangerouslySetInnerHTML={
                        typeof lastStyleData.title === 'string' 
                            ? { __html: lastStyleData.title } 
                            : undefined
                    }
                >
                    {typeof lastStyleData.title !== 'string' ? lastStyleData.title : null}
                </h2>

                <div className="modal-gallery">
                    {!lastStyleData.gallery || lastStyleData.gallery.length === 0 ? (
                        <p className="no-photos">Фотографії відсутні</p>
                    ) : isLoading ? (
                        [...Array(Math.min(lastStyleData.gallery.length, 5))].map((_, index) => (
                            <SkeletonImage key={index} />
                        ))
                    ) : (
                        lastStyleData.gallery.map((imgSrc, index) => (
                            <div key={index} className="gallery-item">
                                <img 
                                    src={imgSrc} 
                                    alt={`Фото кухні ${index + 1}`} 
                                    loading="lazy"
                                />
                            </div>
                        ))
                    )}
                </div>
                
            </div>
        </div>
    );
}

export default React.memo(ModalCitchenCatalog);
