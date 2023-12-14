import './DeleteTermModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';

import { Modal } from 'antd';

import { Term } from '@/models/streetcode/text-contents.model';

interface Props {
    handleDelete: (id: number) => void;
    term: Partial<Term> | undefined;
}

const DeleteTermModal = ({ handleDelete, term } : Props) => {
    const { modalStore: { setModal, modalsState: { deleteTerm } } } = useModalContext();

    return (
        <Modal
            className="deleteModal"
            closeIcon={<CancelBtn />}
            open={deleteTerm.isOpen}
            onCancel={() => setModal('deleteTerm')}
            onOk={() => {
                handleDelete(term?.id as number);
                setModal('deleteTerm');
            }}
        >
            <h2>Ви впевнені, що бажаєте видалити визначення?</h2>
            <p>
                {term?.description}
            </p>
        </Modal>
    );
};

export default observer(DeleteTermModal);
