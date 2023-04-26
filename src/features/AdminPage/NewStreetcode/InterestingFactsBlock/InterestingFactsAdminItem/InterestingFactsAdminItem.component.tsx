import './InterestingFactsAdminItem.style.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

import InterestingFactsAdminModal from '../FactsAdminModal/InterestingFactsAdminModal.component';

interface Props {
    fact: Fact,
    facts: Fact[];
    setFacts: React.Dispatch<React.SetStateAction<Fact[]>>,

}
const InterestingFactAdminItem = ({ fact, facts, setFacts }: Props) => {
    const { factsStore } = useMobx();
    const [openModal, setModalOpen] = useState<boolean>(false);
    const [factTitle, setFactTitle] = useState<string>();
    const [factId, setFactId] = useState<number>(0);

    // const deleteFact = () => {
    //     // factsStore.deleteFactFromMap(fact.id);
    //     factsStore.deleteFact(fact.id);
    //     console.log('Deleted');
    // };
    // useAsync(() => {
    //     deleteFact();
    // });
    return (
        <div className="interestingFactItem">
            <div className="item">
                <div className="faIcon">
                    <FaPencilAlt onClick={() => setModalOpen(true)} />
                </div>
                <p>
                    {/* {facts.map((f) => (
                        f.title
                    ))} */}
                    {fact.title}
                    {/* {factTitle} */}
                </p>
                <div className="faIcon">
                    <FaRegTrashAlt onClick={() => factsStore.deleteFactFromMap(fact.id)} />
                    {/* // onClick={() => factsStore.deleteFactFromMap(fact.id)} */}
                </div>
                <div>

                    {/* {facts.map((fact) => ( */}
                    <InterestingFactsAdminModal fact={fact} facts={facts} setFacts={setFacts} setModalOpen={setModalOpen} open={openModal} />
                    {/* ))} */}

                </div>

            </div>
        </div>
    );
};

export default observer(InterestingFactAdminItem);