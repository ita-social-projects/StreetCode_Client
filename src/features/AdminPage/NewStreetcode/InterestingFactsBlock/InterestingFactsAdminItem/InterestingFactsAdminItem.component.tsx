import './InterestingFactsAdminItem.style.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';

import InterestingFactsAdminModal from '../FactsAdminModal/InterestingFactsAdminModal.component';

interface Props {
    facts: Fact[];
    setFacts: React.Dispatch<React.SetStateAction<Fact[]>>,

}
const InterestingFactAdminItem = ({ facts, setFacts }: Props) => {
    const { factsStore } = useMobx();
    const [openModal, setModalOpen] = useState<boolean>(false);

    return (
        <div className="interestingFactItem">
            <div className="item">
                <div className="faIcon">
                    <FaPencilAlt onClick={() => setModalOpen(true)} />
                </div>
                <p>
                    {facts.map((f) => (
                        f.title
                    ))}
                    {/* {fact.title} */}
                </p>
                <div className="faIcon">
                    <FaRegTrashAlt />
                    {/* // onClick={() => factsStore.deleteFactFromMap(fact.id)} */}
                </div>
                <div>

                    {facts.map((fact) => (
                        <InterestingFactsAdminModal fact={fact} setFacts={setFacts} setModalOpen={setModalOpen} open={openModal} />
                    ))}

                </div>

            </div>
        </div>
    );
};

export default observer(InterestingFactAdminItem);