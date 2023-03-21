import './ForFansBlock.style.scss';

import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';

import ForFansAdminItem from './ForFansAdminItem/ForFansAdminItem.component'; // InterestingFactAdminItem from './InterestingFactsAdminItem/InterestingFactsAdminItem.component';

const ForFansBlock = () => {
    const streetcodeId = 2;// useRouteId();
    const { factsStore: { fetchFactsByStreetcodeId, getFactArray } } = useMobx();

    useAsync(
        () => fetchFactsByStreetcodeId(streetcodeId),
        [streetcodeId],
    );
    const { modalStore: { setModal } } = useMobx();

    return (
        <div className="forFansBlock">
            <div className="factsHeader">
                <h2>
                   Для фанатів
                </h2>
            </div>
            <div className="factsContainer">
                <button className="addForFans" onClick={() => setModal('addForFans')}>+</button>
                {getFactArray.map((fact) => (
                    <ForFansAdminItem
                        fact={fact}
                    />
                ))}
            </div>
        </div>
    );
};

export default ForFansBlock;