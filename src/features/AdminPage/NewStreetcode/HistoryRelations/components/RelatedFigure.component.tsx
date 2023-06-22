import { useCallback, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

import { Modal } from 'antd';

import { RelatedFigureCreateUpdate } from '@/models/streetcode/related-figure.model';

interface Props {
    figure: RelatedFigureCreateUpdate
    handleDelete: (id: number) => void;
}
const RelatedItem = ({ figure, handleDelete } : Props) => {
    const [visibleModal, setVisibleModal] = useState(false);
    const handleRemove = useCallback(() => {
        setVisibleModal(true);
    }, []);

    const handleCancelModalRemove = useCallback(() => {
        setVisibleModal(false);
    }, []);

    return (
        <div className="relationItem">
            <span className="text">{figure.title}</span>
            <div className="actions">
                <span onClick={() => handleRemove()}>
                    <DeleteOutlined />
                </span>
            </div>
            <Modal
                title="Ви впевнені, що хочете видалити даний Зв'язок історії?"
                open={visibleModal}
                onOk={(e) => {
                    handleDelete(figure.id);
                    setVisibleModal(false);
                }}
                onCancel={handleCancelModalRemove}
            />
        </div>
    );
};

export default RelatedItem;
