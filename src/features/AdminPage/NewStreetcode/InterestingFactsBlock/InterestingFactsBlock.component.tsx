import './InterestingFactsBlock.style.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useParams } from 'react-router-dom';

import InterestingFactsAdminModal from './FactsAdminModal/InterestingFactsAdminModal.component';
import InterestingFactAdminItem from './InterestingFactsAdminItem/InterestingFactsAdminItem.component';

const InterestingFactsBlock = () => {
    const { factsStore, streetcodeStore } = useMobx();
    const [openModal, setModalOpen] = useState<boolean>(false);

    const { fetchFactsByStreetcodeId, getFactArray } = factsStore;
    const { id } = useParams<any>();
    const parseId = id ? +id : null;
    useAsync(
        () => fetchFactsByStreetcodeId(parseId),
        [parseId],
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
                {getFactArray.map((fact) => (
                    <InterestingFactAdminItem
                        fact={fact}
                    />
                ))}
            </div>
            <div>
                {getFactArray.map((fact) => (
                    <InterestingFactsAdminModal fact={fact} setModalOpen={setModalOpen} open={openModal} />
                ))}
            </div>
        </div>
    );
};

export default observer(InterestingFactsBlock);
