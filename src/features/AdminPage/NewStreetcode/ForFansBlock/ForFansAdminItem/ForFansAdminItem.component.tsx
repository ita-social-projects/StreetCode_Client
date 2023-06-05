import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useMobx from '@stores/root-store';

import { Modal } from 'antd';

const ForFansAdminItem: React.FC<{
    index:number,
    categoryName: string,
    onEditClick: () => void
}> = ({ index, categoryName, onEditClick }) => {
    const { sourceCreateUpdateStreetcode } = useMobx();
    const [visibleModal, setVisibleModal] = useState(false);

    const handleRemove = useCallback(() => {
        setVisibleModal(true);
    }, []);

    const handleCancelModalRemove = useCallback(() => {
        setVisibleModal(false);
    }, []);

    return (
        <div className="textBlockButton">
            <div className="item">
                <div className="blockItem">
                    <EditOutlined onClick={onEditClick} />
                </div>
                <p>
                    {categoryName}
                </p>
                <div className="blockItem">
                    <DeleteOutlined onClick={() => handleRemove()} />
                </div>
                <Modal
                    title="Ви впевнені, що хочете видалити дану категорію?"
                    open={visibleModal}
                    onOk={(e) => {
                        sourceCreateUpdateStreetcode.removeSourceCategoryContent(index); setVisibleModal(false);
                    }}
                    onCancel={handleCancelModalRemove}
                />
            </div>
        </div>
    );
};

export default observer(ForFansAdminItem);
