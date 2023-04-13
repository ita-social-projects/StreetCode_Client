import './InterestingFactsAdminItem.style.scss';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';
// import InterestingFactsAdminModal from './FactsAdminModal/InterestingFactsAdminModal.component';
import { useState, useEffect} from 'react';
import InterestingFactsAdminModal from '../FactsAdminModal/InterestingFactsAdminModal.component';
import { observer } from 'mobx-react-lite';


interface Props {
    fact: Fact;
}

const InterestingFactAdminItem = ({ fact } : Props) => {
    const { factsStore } = useMobx();
    const [openModal, setModalOpen] = useState<boolean>(false);

    const deleteFact = () => {
        factsStore.deleteFactFromMap(fact.id);
        console.log("delete");
    }
    // useEffect(() => {
    //     // Delete the "name" property from myObject after the component renders
    //     return () => {
    //     deleteFact();  
    //     };
    //   }, []);
    return (
        <div className="interestingFactItem">
            <div className="item">
                <div className="faIcon">
                    {/* <FaPencilAlt onClick={() => setModal('adminFacts')} /> */}
                    <FaPencilAlt onClick={() => setModalOpen(true)} />

                </div>
                <p>
                    {fact.title}
                </p>
                <div className="faIcon">
                    <FaRegTrashAlt onClick={deleteFact} />
                    {/* <FaRegTrashAlt onClick={() => factsStore.deleteFactFromMap(fact.id)} /> */}
                   
                    {/* <DeleteOutlined onClick={() => factsStore.deleteFactFromMap(fact.id)} /> */}
                    {/* <FaRegTrashAlt onClick={deleteFact} /> */}
                </div>
                <div>
                <InterestingFactsAdminModal fact={fact} setModalOpen={setModalOpen} open={openModal} />
                </div>

            </div>
        </div>
    );
};

export default observer(InterestingFactAdminItem);
