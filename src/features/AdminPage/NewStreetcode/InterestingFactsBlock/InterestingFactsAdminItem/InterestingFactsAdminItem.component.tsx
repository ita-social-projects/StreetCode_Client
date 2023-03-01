import './InterestingFactsAdminItem.style.scss';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { Fact } from '@models/streetcode/text-contents.model';

interface Props {
    fact: Fact;
}

const InterestingFactsItem = ({ fact: { title } } : Props) => (
    <div className="interestingFactItem">
        <div className="item">
            <p>
                <FaPencilAlt className="faIcon" />
                {title}
                <FaRegTrashAlt className="faIcon" />
            </p>
        </div>
    </div>
);

export default InterestingFactsItem;
