import EventStreetcode from '../../../../../models/streetcode/related-figure.model';
import { DeleteOutlined, PictureOutlined } from '@ant-design/icons';

interface Props {
    relation: EventStreetcode;
    relations: Array<EventStreetcode>;
    setRelations: React.Dispatch<React.SetStateAction<Array<EventStreetcode>>>;
};

const RelatedItem = ({relation, relations, setRelations} : Props) => {
    const deleteRelationHandle = async (id: number) => {
        const newRelatedSCs = relations.filter((rel) => rel.id !== id);
        setRelations(newRelatedSCs);
    }

    return (
        <div className="relationItem">
            <span className='text'>{relation.title}</span>
            <div className='actions'>
                <span onClick={() => deleteRelationHandle(relation.id)}>
                    <DeleteOutlined/>
                </span>
            </div>
        </div>
    )
}

export default RelatedItem;