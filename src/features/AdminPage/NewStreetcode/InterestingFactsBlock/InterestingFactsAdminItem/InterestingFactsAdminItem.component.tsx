import './InterestingFactsAdminItem.style.scss';
import { Fact } from '@models/streetcode/text-contents.model';

interface Props {
    fact: Fact;
}

const InterestingFactsItem = ({
    fact: { title },
} : Props) => {
    return(
        <div className='interestingFactBlock'>

         <div className="item">
            <p>
                {title}
            </p>
         </div>
         
        </div>)

};

export default InterestingFactsItem;
