import blumLogo from '../assets/images/logo/blum-logo.png';
import eEggerLogo from '../assets/images/logo/e-egger-logo.png';
import giffLogo from '../assets/images/logo/giff-logo.png';
import hettichLogo from '../assets/images/logo/hettich-logo.png';
import kesseboshmerLogo from '../assets/images/logo/kesseboshmer-logo.png';
import kronasLogo from '../assets/images/logo/kronas-logo.png';
import stoneLeft from '../assets/images/stone/stone 1.png';
import stoneLeftDark from '../assets/images/stone/stone dark 1.png';
import { getContentText, HOME_FALLBACKS } from '../content/homeContent';

import '../assets/styles/PartnersConteiner.css';

function PartnersConteiner({ theme, contentMap }) {
    const partners = [
        { className: 'hettich-logo', src: hettichLogo, alt: 'Hettich International' },
        { className: 'blum-logo', src: blumLogo, alt: 'Blum' },
        { className: 'giff-logo', src: giffLogo, alt: 'Giff' },
        { className: 'eEgger-logo', src: eEggerLogo, alt: 'Egger' },
        { className: 'kronas-logo', src: kronasLogo, alt: 'Kronas' },
        { className: 'kesseboshmer-logo', src: kesseboshmerLogo, alt: 'Kessebohmer' }
    ];

    const title = getContentText(contentMap, 'partners-title', HOME_FALLBACKS.partnersTitle);

    return (
        <section className='partners-conteiner' id='partners'>
            <h4 
                className='title-partners'
                dangerouslySetInnerHTML={{ __html: title }}
            />

            <div className={theme === 'light' ? 'logo-partners' : 'logo-partners-dark'}>
                {partners.map((partner, index) => (
                    <div
                        key={index}
                        className={theme === 'light' ? partner.className : `${partner.className}-dark`}
                    >
                        <img src={partner.src} alt={partner.alt} loading='lazy' />
                    </div>
                ))}
            </div>

            <img
                className='stone-left-in-partners-conteiner theme-image-light'
                src={stoneLeft}
                alt=''
                aria-hidden='true'
            />
            <img
                className='stone-left-in-partners-conteiner theme-image-dark'
                src={stoneLeftDark}
                alt=''
                aria-hidden='true'
            />
        </section>
    );
}

export default PartnersConteiner;
