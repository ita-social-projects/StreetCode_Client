import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';
import useMobx, { useModalContext } from '@stores/root-store';

const CategoriesAdminItem: React.FC<{
    index:number,
    categoryName: string,
    onEditClick: () => void
}> = ({ index, categoryName, onEditClick }) => {
    const { sourceCreateUpdateStreetcode } = useMobx();
    const { modalStore } = useModalContext();

    const handleRemove = useCallback(() => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                sourceCreateUpdateStreetcode.removeSourceCategoryContent(index);
            },
            CONFIRMATION_MESSAGES.DELETE_CATEGORY,
        );
    }, []);

    return (
        <div className="textBlockButton">
            <div className="item">
                <div className="blockItem">
                    <EditOutlined onClick={() => onEditClick()} />
                </div>
                <p>
                    {categoryName}
                </p>
                <div className="blockItem">
                    <DeleteOutlined onClick={() => handleRemove()} />
                </div>
            </div>
        </div>
    );
};

export default observer(CategoriesAdminItem);
