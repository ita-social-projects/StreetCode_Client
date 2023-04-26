import { observer } from 'mobx-react-lite';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import useMobx from '@stores/root-store';

const ForFansAdminItem: React.FC<{
    index:number,
    categoryName: string, onEditClick: () => void
}> = ({ index, categoryName, onEditClick }) => {
         const { sourceCreateUpdateStreetcode } = useMobx();
         return (
             <div className="textBlockButton">
                 <div className="item">
                     <div className="blockItem">
                         <FaPencilAlt onClick={onEditClick} />
                     </div>
                     <p>
                         {categoryName}
                     </p>
                     <div className="blockItem">
                         <FaRegTrashAlt onClick={
                             () => {
                                 sourceCreateUpdateStreetcode.removeSourceCategoryContent(index);
                             }
                         }
                         />
                     </div>
                 </div>
             </div>
         );
     };

export default observer(ForFansAdminItem);
