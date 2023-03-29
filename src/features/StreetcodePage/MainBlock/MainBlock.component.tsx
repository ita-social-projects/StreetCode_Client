import './MainBlock.styles.scss';

import BreadCrumb from '@streetcode/MainBlock/BreadCrumb/BreadCrumb.component';
import StreetcodeCard from '@streetcode/MainBlock/StreetcodeCard/StreetcodeCard.component';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import ListenTextModal from '@/app/common/components/modals/ListenText/ListenText.component';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';
import Streetcode from '@/models/streetcode/streetcode-types.model';

interface Props {
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>,
    setActiveBlock: React.Dispatch<React.SetStateAction<number>>
}

const MainBlock = ({ setActiveTagId, setActiveBlock } : Props) => {
    const streetcodeUrl = useRouteUrl();
    const { value } = useAsync(() => StreetcodesApi.getByUrl(streetcodeUrl), [streetcodeUrl]);
    const streetcode = value as Streetcode;

    return (
        <div id="mainBlock" className="blockCentering margin-82px bgr">
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
    );
};

export default MainBlock;
