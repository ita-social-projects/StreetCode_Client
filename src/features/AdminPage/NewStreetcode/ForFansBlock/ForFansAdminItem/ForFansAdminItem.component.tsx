// import './InterestingFactsAdminItem.style.scss';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';

interface Props {
    fact: Fact;
}
//  const { modalStore: { setModal } } = useMobx();

//  const InterestingFactItem = ({
//     fact: { factContent, title, id },
// }: Props) => {
//     const { modalStore: { setModal } } = useMobx();
// )

const ForFansItem = ({ fact: { title, id } } : Props) => {
    const { modalStore: { setModal } } = useMobx();
    return (
        <div className="forFansItem">
            <div className="item">
                <div className="faIcon">
                    <FaPencilAlt onClick={() => setModal('editForFans')} />
                </div>
                <p>
                    {title}
                </p>
                <div className="faIcon">
                    <FaRegTrashAlt />
                </div>
            </div>
        </div>
    );
};

export default ForFansItem;
