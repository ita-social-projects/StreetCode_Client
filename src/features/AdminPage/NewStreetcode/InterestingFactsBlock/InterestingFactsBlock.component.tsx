import './InterestingFactsBlock.style.scss';

import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

import InterestingFactAdminItem from './InterestingFactsAdminItem/InterestingFactsAdminItem.component';

const InterestingFactsBlock = () => {
    const { factsStore, streetcodeStore, modalStore: { setModal } } = useMobx();
    const { fetchFactsByStreetcodeId, getFactArray } = factsStore;
    const { getStreetCodeId } = streetcodeStore;

    useAsync(
        () => fetchFactsByStreetcodeId(getStreetCodeId),
        [getStreetCodeId],
    );
    return (
        <div className="adminContainer-block">
            <h2>Wow-факти</h2>
            <div>
                <button className="buttonWithPlus" onClick={() => setModal('adminFacts')}>+</button>
                {getFactArray.map((fact) => (
                    <InterestingFactAdminItem
                        fact={fact}
                    />
                ))}
            </div>
        </div>
    );
};

export default InterestingFactsBlock;
