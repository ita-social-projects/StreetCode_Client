import './InterestingFactsBlock.style.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

import InterestingFactsAdminModal from './FactsAdminModal/InterestingFactsAdminModal.component';
import InterestingFactAdminItem from './InterestingFactsAdminItem/InterestingFactsAdminItem.component';

interface Props {
    facts: Fact[],
    setFacts: React.Dispatch<React.SetStateAction<Fact[]>>,
}
const InterestingFactsBlock = ({ facts, setFacts }: Props) => {
    // const { factsStore, streetcodeStore } = useMobx();
    const [openModal, setModalOpen] = useState<boolean>(false);

    // const { fetchFactsByStreetcodeId, getFactArray } = factsStore;
    // const { id } = useParams<any>();
    // const parseId = id ? +id : null;
    // useAsync(
    //     () => fetchFactsByStreetcodeId(parseId),
    //     [parseId],
    // );
    return (
        <div className="interestingFactsBlock">
            <div className="factsHeader">
                <h2>
                    Wow-факти
                </h2>
            </div>
            <div className="factsContainer">
                <button className="addWowFact" onClick={() => setModalOpen(true)}> + </button>
                {facts.map((fact) => (
                    <InterestingFactAdminItem
                        fact={fact}
                        setFacts={setFacts}
                    />
                ))}
            </div>
            <div>
                <InterestingFactsAdminModal setModalOpen={setModalOpen} open={openModal} />

            </div>
        </div>
    );
};

export default observer(InterestingFactsBlock);