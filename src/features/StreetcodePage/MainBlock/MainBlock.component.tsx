import './MainBlock.styles.scss';

import { useRouteId } from '@hooks/stateful/useRouter.hook';
import BreadCrumb from '@streetcode/MainBlock/BreadCrumb/BreadCrumb.component';
import StreetcodeCard from '@streetcode/MainBlock/StreetcodeCard/StreetcodeCard.component';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import ListenTextModal from '@/app/common/components/modals/ListenText/ListenText.component';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import Streetcode from '@/models/streetcode/streetcode-types.model';

interface Props {
    activeTagId: number,
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>
}

const MainBlock = ({ activeTagId, setActiveTagId } : Props) => {
    const id = useRouteId();

    const { value } = useAsync(() => StreetcodesApi.getById(id), [id]);
    const streetcode = value as Streetcode;

    return (
        <div id="mainBlock" className="blockCentering margin-82px bgr">
            <div className="mainContainer">
                <BreadCrumb separator={<div className="separator" />} streetcode={streetcode} />
                <div className="blockCentering">
                    <div className="mainContent">
                        <StreetcodeCard
                            streetcode={streetcode}
                            activeTagId={activeTagId}
                            setActiveTagId={setActiveTagId}
                        />
                    </div>
                </div>
            </div>
            <ListenTextModal />
        </div>
    );
};

export default MainBlock;
