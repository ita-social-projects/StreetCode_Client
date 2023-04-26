import './ForFansAdminItem.style.scss';

import { observer } from 'mobx-react-lite';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import useMobx from '@stores/root-store';

const ForFansAdminItem:React.FC<{ id:number,
     categoryName:string, onEditClick:()=>void }> = ({ id, categoryName, onEditClick }) => {
         const { sourceCreateUpdateStreetcode } = useMobx();
         return (
             <div className="forFansItem">
                 <div className="item">
                     <div className="faIcon">
                         <FaPencilAlt onClick={onEditClick} />
                     </div>
                     <p>
                         {categoryName}
                     </p>
                     <div className="faIcon">
                         <FaRegTrashAlt onClick={
                             () => {
                                 sourceCreateUpdateStreetcode.removeSourceCategoryContent(id);
                             }
                         }
                         />
                     </div>
                 </div>
             </div>
         );
     };

export default observer(ForFansAdminItem);
