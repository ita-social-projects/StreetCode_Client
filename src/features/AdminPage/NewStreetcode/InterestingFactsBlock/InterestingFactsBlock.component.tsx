import './InterestingFactsBlock.style.scss';

import { useState } from 'react';
import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

import InterestingFactAdminItem from './InterestingFactsAdminItem/InterestingFactsAdminItem.component';
import InterestingFactsAdminModal from './FactsAdminModal/InterestingFactsAdminModal.component';

const InterestingFactsBlock = () => {
    const { factsStore, streetcodeStore, modalStore: { setModal } } = useMobx();
    const [openModal, setModalOpen] = useState<boolean>(false);

    const { fetchFactsByStreetcodeId, getFactArray } = factsStore;
    const { getStreetCodeId } = streetcodeStore;

    useAsync(
        () => fetchFactsByStreetcodeId(getStreetCodeId),
        [getStreetCodeId],
    );

    return (
        <div className="interestingFactsBlock">
            <div className="factsHeader">
                <h2>
                   Wow-факти
                </h2>
            </div>
            <div className="factsContainer">
                <button className="addWowFact" onClick={() => setModalOpen(true)}> + </button>
                {/* <button className="addWowFact" onClick={() => setModalOpen(true)}> + </button> */}
                {/* <button className="addWowFact" onClick={() => setModal('adminFacts')}>+</button> */}
                {getFactArray.map((fact) => (
                    <InterestingFactAdminItem
                        fact={fact}
                    />
                ))}
            </div>
            <div>
            <InterestingFactsAdminModal setModalOpen={setModalOpen} open={openModal} />
            </div>
        </div>
    );
};

export default InterestingFactsBlock;
