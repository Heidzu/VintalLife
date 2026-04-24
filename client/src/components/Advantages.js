import { useEffect, useMemo, useRef, useState } from 'react';
import ellipse from '../assets/images/icons/Ellipse 1.png';
import rectangleDark from '../assets/images/icons/Rectangle 2.png';
import rectangleLight from '../assets/images/icons/Rectangle 2 wight.png';
import stoneSecondDark from '../assets/images/stone/stone dark 2.png';
import stoneSecond from '../assets/images/stone/stone 2.png';
import { getContentText, getContentTitle, HOME_FALLBACKS } from '../content/homeContent';
import '../assets/styles/Advantages.css';

function Advantages({ contentMap, isContentLoading }) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const advantagesData = useMemo(
        () => HOME_FALLBACKS.advantages.map((item, index) => {
            const key = `advantages-item-${index + 1}`;

            return {
                title: getContentTitle(contentMap, key, item.title),
                value: getContentText(contentMap, key, item.value)
            };
        }),
        [contentMap]
    );

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

    return (
        <section className='advantages' ref={sectionRef} id='advantages' aria-busy={isContentLoading}>
            <img
                className='adv-second-stone theme-image-light'
                src={stoneSecond}
                alt=''
                aria-hidden='true'
            />
            <img
                className='adv-second-stone theme-image-dark'
                src={stoneSecondDark}
                alt=''
                aria-hidden='true'
            />
            <div className='advantages-wrapper'>
                <div className='advantages-grid'>
                    <img
                        className={`advantages-line theme-image-light ${isVisible ? 'visible delay-2' : ''}`}
                        src={rectangleDark}
                        alt=''
                        aria-hidden='true'
                    />
                    <img
                        className={`advantages-line theme-image-dark ${isVisible ? 'visible delay-2' : ''}`}
                        src={rectangleLight}
                        alt=''
                        aria-hidden='true'
                    />
                    {advantagesData.map((item, index) => (
                        <div className='advantage-col' key={`${item.title}-${index}`}>
                            <p className={`adv-title ${isVisible ? 'visible delay-1' : ''}`}>
                                {item.title}
                            </p>

                            <div className={`adv-dot-wrapper ${isVisible ? 'visible delay-2' : ''}`}>
                                <img className='ellipse-icon' src={ellipse} alt='' aria-hidden='true' />
                            </div>

                            <p className={`adv-value ${isVisible ? 'visible delay-3' : ''}`}>
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Advantages;
