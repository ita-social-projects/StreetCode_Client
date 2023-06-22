import './AddTermModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';

import { Button, Form, Input, Modal } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import { Term } from '@/models/streetcode/text-contents.model';

interface Props {
    handleAdd: (id: number, title: string, description: string | undefined) => void;
    term: Partial<Term> | undefined;
    setTerm: React.Dispatch<React.SetStateAction<Partial<Term> | undefined>>;
}

const AddTermModal = ({ handleAdd, term, setTerm } : Props) => {
    const { modalStore: { setModal, modalsState: { addTerm } } } = useModalContext();
    const [form] = Form.useForm();
    const handleChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTerm({ ...term, description: e.target.value });
    };

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTerm({ ...term, title: e.target.value });
    };

    const onSuccessfulSubmit = () => {
        handleAdd(term?.id as number, term?.title as string, term?.description);
        setModal('addTerm');
        form.resetFields();
    };

    const onCancel = () => {
        form.resetFields();
        setModal('addTerm');
    };

    return (
        <Modal
            className="editModal"
            open={addTerm.isOpen}
            onCancel={onCancel}
            footer={[null]}
            closeIcon={<CancelBtn />}
        >
            <h2>Створення визначення</h2>
            <Form form={form} onFinish={onSuccessfulSubmit} layout="vertical">
                <FormItem
                    name="title"
                    label="Назва"
                    rules={[{ required: true, message: 'Введіть назву' }]}
                >
                    <Input value={term?.title} onChange={handleChangeTitle} showCount maxLength={50} />
                </FormItem>
                <FormItem
                    name="description"
                    label="Визначення"
                    rules={[{ required: true, message: 'Введіть опис' }]}
                >
                    <TextArea value={term?.description} onChange={handleChangeDesc} />
                </FormItem>
                <Button className="streetcode-custom-button" onClick={() => form.submit()}>
                    Зберегти
                </Button>
            </Form>
        </Modal>
    );
};

export default observer(AddTermModal);
