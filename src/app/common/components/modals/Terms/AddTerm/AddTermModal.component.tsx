import '../../../../../../features/AdminPage/AdminModal.styles.scss'

import CancelBtn from '@images/utils/Cancel_btn.svg';
import { Term } from '@/models/streetcode/text-contents.model';
import { observer } from 'mobx-react-lite';
import { Button, Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import Modal from 'antd/es/modal/Modal';
import useMobx from '@stores/root-store';

interface Props {
    handleAdd: () => void;
    term: Partial<Term> | undefined;
    setTerm: React.Dispatch<React.SetStateAction<Partial<Term> | undefined>>;
}

const AddTermModal = ({ handleAdd, term, setTerm } : Props) => {
    const { modalStore: { setModal, modalsState: { addTerm } } } = useMobx();
    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTerm({ ...term, title: e.target.value });
    };
    
    const handleChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTerm({ ...term, description: e.target.value });
    };

    return (
        <Modal
            className="addModal"
            open={addTerm.isOpen}
            onCancel={() => setModal('addTerm')}
            footer={[
                <Button
                    className="submit"
                    onClick={() => {
                        handleAdd();
                        setModal('addTerm');
                    }}
                >
                    Зберегти
                </Button>,
            ]}
            closeIcon={<CancelBtn />}
        >
            <h2>Створення нового визначення</h2>
            <Form id="myForm" onFinish={() => handleAdd}>
                <FormItem label="Назва">
                    <Input onChange={handleChangeTitle} />
                </FormItem>
                <FormItem label="Визначення">
                    <TextArea onChange={handleChangeDesc} />
                </FormItem>
            </Form>
        </Modal>
    );
};

export default observer(AddTermModal);
