import './ListenText.styles.scss';

import ExitBtn from '@images/audio-player/ExitBtn.png';

import { observer } from 'mobx-react-lite';
import { AudioPlayer } from '@components/AudioPlayer/AudioPlayer.component';
import useMobx from '@stores/root-store';

const ListenTextModal = () => {
    const { modalStore } = useMobx();
    const { setModal, modalsState: { audio } } = modalStore;

    return (
        <>
            {audio.isOpen
            && (
                <div className="modal">
                    <AudioPlayer />
                    <img
                        src={ExitBtn}
                        alt=""
                        className="closeModal"
                        onClick={() => setModal('audio')}
                    />
                </div>
            )}
        </>
    );
};

export default observer(ListenTextModal);
