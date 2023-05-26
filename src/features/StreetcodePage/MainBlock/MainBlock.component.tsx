import './MainBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import BreadCrumb from '@streetcode/MainBlock/BreadCrumb/BreadCrumb.component';
import StreetcodeCard from '@streetcode/MainBlock/StreetcodeCard/StreetcodeCard.component';

import ListenTextModal from '@/app/common/components/modals/ListenText/ListenText.component';
import Streetcode from '@/models/streetcode/streetcode-types.model';

interface Props {
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>,
    setActiveBlock: React.Dispatch<React.SetStateAction<number>>,
    streetcode?: Streetcode,
}

const MainBlock = ({ setActiveTagId, setActiveBlock, streetcode } : Props) => (streetcode && (
    <div id="mainBlock" className="mainBlock">
        <div className="mainContainer">
            <BreadCrumb separator={<div className="separator" />} streetcode={streetcode} />
            <div className="blockCentering">
                <div className="mainContent">
                    <StreetcodeCard
                        streetcode={streetcode}
                        setActiveTagId={setActiveTagId}
                        setActiveBlock={setActiveBlock}
                    />
                </div>
            </div>
        </div>
        <ListenTextModal />
    </div>
)
);

export default observer(MainBlock);