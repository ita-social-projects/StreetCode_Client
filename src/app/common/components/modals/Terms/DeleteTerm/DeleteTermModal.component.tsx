import './DeleteTermModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';

import { Button, Modal } from 'antd';

import { Term } from '@/models/streetcode/text-contents.model';

interface Props {
    handleDelete: (id: number) => void;
    term: Partial<Term> | undefined;
}

const DeleteTermModal = ({ handleDelete, term } : Props) => {
    const { modalStore: { setModal, modalsState: { deleteTerm } } } = useMobx();

    return (
        <Modal
            className="deleteModal"
            closeIcon={<CancelBtn />}
            open={deleteTerm.isOpen}
            onCancel={() => setModal('deleteTerm')}
            footer={[
                <Button onClick={() => setModal('deleteTerm')}>Відміна</Button>,
                <Button
                    className="submit"
                    onClick={() => {
                        handleDelete(term?.id as number);
                        setModal('deleteTerm');
                    }}
                >
                    Видалити
                </Button>,
            ]}
        >
            <h2>Ви впевнені, що бажаєте видалити визначення?</h2>
            <p>
                {term?.description}
            </p>
        </Modal>
    );
};

export default observer(DeleteTermModal);
