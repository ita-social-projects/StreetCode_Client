import './ListenText.styles.scss';

import ExitBtn from '@images/audio-player/ExitBtn.png';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { AudioPlayer } from '@components/AudioPlayer/AudioPlayer.component';
import useMobx, { useModalContext } from '@stores/root-store';

const ListenTextModal = () => {
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { audio } } = modalStore;

    const [closing, setClosing] = useState(false);
    let timeoutId: NodeJS.Timeout;

    const handleClose = () => {
        setClosing(true);
        timeoutId = setTimeout(() => {
            setModal('audio');
            setClosing(false);
        }, 500);
    };

    useEffect(() => () => {
        clearTimeout(timeoutId);
    }, []);

    return (
        <>
            {audio.isOpen && (
                <div className={`modal ${closing ? 'fadeOutAnimation' : 'fadeInAnimation'}`}>
                    <AudioPlayer immediatelyPlay />
                    <img
                        src={ExitBtn}
                        alt="Audio player close button"
                        className="closeModal"
                        onClick={handleClose}
                    />
                </div>
            )}
        </>
    );
};

export default observer(ListenTextModal);
