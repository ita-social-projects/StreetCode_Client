import "./ListenText.styles.scss"

import { AudioPlayer } from '@/app/common/components/AudioPlayer/AudioPlayer.component';
import ExitBtn from '@images/audio-player/ExitBtn.png';
import useMobx from '@/app/stores/root-store';
import { observer } from 'mobx-react-lite';

interface Props {

}

const ListenTextModal = (props: Props) => {
    const { modalStore } = useMobx();
    const { setModal, modalsState: { audio } } = modalStore;
    
    return (
        <>
        {audio.isOpen && 
            <div className="modal">
                <AudioPlayer/> 
                <img src={ExitBtn} className={"closeModal"} onClick={()=> setModal('audio')}/>
            </div>}
        </>
    );
}

export default observer(ListenTextModal);