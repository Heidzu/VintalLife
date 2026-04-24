import lightMenu from '../assets/images/icons/menu burger wight.png';
import darkMenu from '../assets/images/icons/menu burger.png';
import CustomMenu from './CustomMenu';

function BurgerMenu({ theme, isMenuOpen, setIsMenuOpen }) {
    const handleOpenMenu = () => setIsMenuOpen(true);
    const handleCloseMenu = () => setIsMenuOpen(false);

    return (
        <div className='burger-menu-wrapper'>
            <button
                type='button'
                className='burger-menu'
                onClick={handleOpenMenu}
                aria-label='Відкрити меню'
                aria-expanded={isMenuOpen}
                aria-controls='custom-site-menu'
            >
                <img
                    className='burger-menu-icon theme-image-light'
                    src={darkMenu}
                    alt=''
                    aria-hidden='true'
                />
                <img
                    className='burger-menu-icon theme-image-dark'
                    src={lightMenu}
                    alt=''
                    aria-hidden='true'
                />
            </button>

            <CustomMenu
                isOpen={isMenuOpen}
                onClose={handleCloseMenu}
                theme={theme}
                menuId='custom-site-menu'
            />
        </div>
    );
}

export default BurgerMenu;
