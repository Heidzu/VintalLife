import logo from '../assets/images/logo/Logo wight.png';
import { getContentText, HOME_FALLBACKS } from '../content/homeContent';
import '../assets/styles/Footer.css';

function Footer({ theme, setIsModalOpen, contentMap, isContentLoading }) {
    const phoneNumber = getContentText(contentMap, 'footer-phone', HOME_FALLBACKS.footerPhone);
    const callbackButtonText = getContentText(
        contentMap,
        'footer-button',
        HOME_FALLBACKS.footerButton
    );
    const copyrightText = getContentText(
        contentMap,
        'footer-copyright',
        HOME_FALLBACKS.footerCopyright
    );

    return (
        <footer
            className={theme === 'light' ? 'footer-component' : 'footer-component-dark'}
            aria-busy={isContentLoading}
        >
            <div className="conteiner-main-function-footer">
                <div className='logo-conteiner'>
                    <img
                        className="logo-footer"
                        src={logo}
                        alt="VintaLife"
                        loading="lazy"
                    />
                </div>

                <nav className="footer-menu" aria-label="Footer navigation">
                    {HOME_FALLBACKS.footerMenuItems.map((item) => (
                        <a className="refs-footer" href={item.href} key={item.href}>
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="right-side-footer">
                    <p className="number-to-call">
                        {phoneNumber}
                    </p>

                    <button
                        className="btn-in-footer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        {callbackButtonText}
                    </button>
                </div>
            </div>

            <p className="text-footer">
                {copyrightText}
            </p>
        </footer>
    );
}

export default Footer;
