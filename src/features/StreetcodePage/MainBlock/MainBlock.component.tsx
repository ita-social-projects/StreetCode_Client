import './MainBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import BreadCrumb from '@streetcode/MainBlock/BreadCrumb/BreadCrumb.component';
import StreetcodeCard from '@streetcode/MainBlock/StreetcodeCard/StreetcodeCard.component';

import ListenTextModal from '@/app/common/components/modals/ListenText/ListenText.component';
import getUrlHash from '@/app/common/utils/getUrlHash.utility';
import Streetcode from '@/models/streetcode/streetcode-types.model';

interface Props {
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>,
    streetcode?: Streetcode,
    setShowAllTags: React.Dispatch<React.SetStateAction<boolean>>,
}

const MainBlock = ({ setActiveTagId, streetcode, setShowAllTags } : Props) => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    useEffect(() => {
        const hash = getUrlHash(location);
        if (!isScrolled && hash === '') {
            setTimeout(() => {
                window.scrollTo(0, 0);
                setIsScrolled(true);
            }, 100);
        }
    });
    return (
        <div id="mainBlock" className="mainBlock">
            <div className="mainContainer">
                <BreadCrumb separator={<div className="separator" />} streetcode={streetcode} />
                <div className="blockCentering">
                    <div className="mainContent">
                        <StreetcodeCard
                            streetcode={streetcode}
                            setActiveTagId={setActiveTagId}
                            setShowAllTags={setShowAllTags}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(MainBlock);
