import './InterestingFactsAdminItem.style.scss';

import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { Fact } from '@models/streetcode/text-contents.model';

interface Props {
    fact: Fact;
}

const InterestingFactsItem = ({ fact: { title } } : Props) => (
    <div className="interestingFactItem">
        <div className="item">
            <div className="faIcon">
                <FaPencilAlt />
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

export default InterestingFactsItem;
