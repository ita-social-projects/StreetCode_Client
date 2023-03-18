import './InterestingFactsBlock.style.scss';

import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';

     import InterestingFactAdminItem from './InterestingFactsAdminItem/InterestingFactsAdminItem.component'; // InterestingFactAdminItem from './InterestingFactsAdminItem/InterestingFactsAdminItem.component';
     import InterestingFactsAdminModal from './FactsAdminModal/InterestingFactsAdminModal.component';
import { useState } from 'react';

const InterestingFactsBlock = () => {
    const streetcodeId = 2;// useRouteId();
    const { factsStore: { fetchFactsByStreetcodeId, getFactArray } } = useMobx();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useAsync(
        () => fetchFactsByStreetcodeId(streetcodeId),
        [streetcodeId],
    );
    return (
        <div className="interestingFactsBlock">
            <div className="factsHeader">
                <h2>
                   Wow-факти
                </h2>
            </div>
            <div className="factsContainer">
                <button className="addWowFact" onClick={() => setIsModalOpen(true)}>+</button>
                {getFactArray.map((fact) => (
                    <InterestingFactAdminItem
                        fact={fact}
                    />
                ))}
            </div>
            <InterestingFactsAdminModal open={isModalOpen} setOpen={setIsModalOpen} />

        </div>
    );
};

export default InterestingFactsBlock;
