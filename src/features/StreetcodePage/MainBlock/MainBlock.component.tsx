import './MainBlock.styles.scss';

import BreadCrumb from '@streetcode/MainBlock/BreadCrumb/BreadCrumb.component';
import StreetcodeCard from '@streetcode/MainBlock/StreetcodeCard/StreetcodeCard.component';
import useMobx from '@/app/stores/root-store';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

const MainBlock = () => {
    const { streetcodesStore: { fetchStreetcode } } = useMobx();

    useAsync(() => fetchStreetcode(1));

    const id: number = 1;
    
    return (
        <div className="blockCentering margin-82px bgr">
            <div className="mainContainer">
                <BreadCrumb separator={<div className={'separator'}/>} streetcodeId={id}/>
                <div className="blockCentering">
                    <div className={'mainContent'}>
                        <StreetcodeCard streetcodeId={id}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainBlock;