import './MainBlock.styles.scss';

import BreadCrumb from '@streetcode/MainBlock/BreadCrumb/BreadCrumb.component';
import StreetcodeCard from '@streetcode/MainBlock/StreetcodeCard/StreetcodeCard.component';

const MainBlock = () => {
    return (
        <div className="blockCentering margin-82px bgr">
            <div className="mainContainer">
                <BreadCrumb separator={<div className={'separator'} />} />
                <div className="blockCentering">
                    <div className={'mainContent'}>
                        <StreetcodeCard />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainBlock;