import './AddTermModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';

import {
    Button, Form, Input, message, Modal, Popover,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import { Term } from '@/models/streetcode/text-contents.model';
import POPOVER_CONTENT from '@/features/AdminPage/JobsPage/JobsModal/constants/popoverContent';
import BUTTON_LABELS from "@constants/buttonLabels";

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
    };

    const onCancel = () => {
        addTerm.isOpen = false;
    };
    const onClear = () => {
        addTerm.isOpen = false;
        form.resetFields();
    };
    const handleOk = async () => {
        try {
            await form.validateFields();
            form.submit();
            message.success('термін успішно додано!', 2);
        } catch (error) {
            message.config({
                top: 100,
                duration: 3,
                maxCount: 3,
                prefixCls: 'my-message',
            });
            message.error("Будь ласка, заповніть всі обов'язкові поля та перевірте валідність ваших даних");
        }
    };

    return (
        <Modal
            className="addModal"
            open={addTerm.isOpen}
            onCancel={onCancel}
            footer={[null]}
            closeIcon={(
                <Popover content={POPOVER_CONTENT.CANCEL} trigger="hover">
                    <CancelBtn className="iconSize" onClick={onClear} />
                </Popover>
            )}
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
                    <TextArea
                        value={term?.description}
                        onChange={handleChangeDesc}
                        showCount
                        maxLength={500}
                    />
                </FormItem>
                <Button className="streetcode-custom-button" onClick={() => handleOk()}>
                    {BUTTON_LABELS.SAVE}
                </Button>
            </Form>
        </Modal>
    );
};

export default observer(AddTermModal);
