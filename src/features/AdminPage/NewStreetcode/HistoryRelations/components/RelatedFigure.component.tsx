import { DeleteOutlined } from '@ant-design/icons';
import RelatedFigure from '@/models/streetcode/related-figure.model';
import { useCallback, useState } from 'react';
import { Modal } from 'antd';
interface Props {
    relation: RelatedFigure;
    relations: Array<RelatedFigure>;
    setRelations: React.Dispatch<React.SetStateAction<Array<RelatedFigure>>>;
    setFigures: React.Dispatch<React.SetStateAction<RelatedFigure[]>>;
}
const RelatedItem = ({ relation, relations, setRelations, setFigures } : Props) => {
    const deleteRelationHandle = async (id: number) => {
        const newRelatedSCs = relations.filter((rel) => rel.id !== id);
        setRelations(newRelatedSCs);
        setFigures(newRelatedSCs);
    };
    const [visibleModal, setVisibleModal] = useState(false);
    const handleRemove = useCallback(() => {
        setVisibleModal(true);
    }, []);

    const handleCancelModalRemove = useCallback(() => {
        setVisibleModal(false);
    }, []);

    return (
        <div className="relationItem">
            <span className="text">{relation.title}</span>
            <div className="actions">
                <span onClick={() => handleRemove()}>
                    <DeleteOutlined />
                </span>
            </div>
            <Modal
                    title="Ви впевнені, що хочете видалити даний Зв'язок історії?"
                    open={visibleModal}
                    onOk={(e) => {deleteRelationHandle(relation.id);setVisibleModal(false);}}
                    onCancel={handleCancelModalRemove}
                />
        </div>
    );
};

export default RelatedItem;
