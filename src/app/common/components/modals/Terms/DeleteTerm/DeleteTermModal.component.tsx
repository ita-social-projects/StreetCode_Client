import './DeleteTermModal.styles.scss';

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
            open={deleteTerm.isOpen}
            onCancel={() => setModal('deleteTerm')}
            footer={[
                <Button
                    danger
                    onClick={() => {
                        handleDelete(term?.id as number);
                        setModal('deleteTerm');
                    }}
                >
                    Видалити
                </Button>,
                <Button onClick={() => setModal('deleteTerm')}>Відміна</Button>,
            ]}
        >
            <h3>Ви впевнені, що бажаєте видалити визначення?</h3>
            <p>
                {term?.title}
                {' - '}
                {term?.description}
            </p>
        </Modal>
    );
};

export default observer(DeleteTermModal);
