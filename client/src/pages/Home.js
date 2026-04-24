import { useState } from 'react';
import Advantages from '../components/Advantages.js';
import ContactComponent from '../components/ContactComponent.js';
import ErrorWindow from '../components/ErrorWindow.js';
import FirstScreen from '../components/FirstScreen.js';
import Footer from '../components/Footer.js';
import InstallmentComponent from '../components/InstallmentComponent.js';
import LeadMagnet from '../components/LeadMagnet.js';
import Modal from '../components/Modal.js';
import PartnersConteiner from '../components/PartnersConteiner.js';
import SliderCatalog from '../components/SliderCatalog.js';
import WindowResult from '../components/WindowResult.js';
import { HOME_CONTENT_KEYS } from '../content/homeContent';
import { useMultipleContents } from '../hooks/useContent';
import '../assets/styles/Home.css';

function Home({ theme, toggleTheme }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const {
        data: contentMap,
        loading: isContentLoading
    } = useMultipleContents(HOME_CONTENT_KEYS, {
        language: 'uk'
    });

    const triggerError = () => {
        if (!isSuccessOpen && !isErrorOpen) {
            setIsErrorOpen(true);
        }
    };

    const triggerSuccess = () => {
        if (!isSuccessOpen && !isErrorOpen) {
            setIsSuccessOpen(true);
        }
    };

    return (
        <div className='home'>
            <FirstScreen
                toggleTheme={toggleTheme}
                theme={theme}
                setIsModalOpen={setIsModalOpen}
                contentMap={contentMap}
                isContentLoading={isContentLoading}
            />
            <Advantages
                contentMap={contentMap}
                isContentLoading={isContentLoading}
            />
            <SliderCatalog theme={theme} contentMap={contentMap} />
            <LeadMagnet
                setIsSuccessOpen={triggerSuccess}
                setIsErrorOpen={triggerError}
                contentMap={contentMap}
            />
            <PartnersConteiner theme={theme} contentMap={contentMap} />
            <InstallmentComponent
                theme={theme}
                setIsSuccessOpen={triggerSuccess}
                setIsErrorOpen={triggerError}
                contentMap={contentMap}
            />
            <ContactComponent
                theme={theme}
                setIsModalOpen={setIsModalOpen}
                contentMap={contentMap}
                isContentLoading={isContentLoading}
            />
            <Footer
                theme={theme}
                setIsModalOpen={setIsModalOpen}
                contentMap={contentMap}
                isContentLoading={isContentLoading}
            />
            <WindowResult
                theme={theme}
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                contentMap={contentMap}
            />
            <ErrorWindow
                theme={theme}
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                contentMap={contentMap}
            />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => setIsSuccessOpen(true)}
                theme={theme}
                contentMap={contentMap}
            />
        </div>
    );
}

export default Home;
