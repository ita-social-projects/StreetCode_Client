import './EditTermModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useModalContext } from '@stores/root-store';

import { Button, Form, Input, Modal } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import { Term } from '@/models/streetcode/text-contents.model';

interface Props {
    handleEdit: (term: Partial<Term>) => void;
    term: Partial<Term> | undefined;
}

const EditTermModal = ({ handleEdit, term } : Props) => {
    const { modalStore: { setModal, modalsState: { editTerm } } } = useModalContext();
    const [form] = Form.useForm();

    const onSuccessfulSubmit = (formValues: any) => {
        const newTerm : Partial<Term> = {
            id: term!.id,
            title: formValues.title,
            description: formValues.description,
        };
        handleEdit(newTerm);
        form.resetFields();
        setModal('editTerm');
    };

    const onCancel = () => {
        form.resetFields();
        setModal('editTerm');
    };

    useEffect(() => {
        form.setFieldsValue({
            title: term?.title,
            description: term?.description,
        });
    }, [form, editTerm]);

    return (
        <Modal
            className="editModal"
            open={editTerm.isOpen}
            onCancel={onCancel}
            footer={[null]}
            closeIcon={<CancelBtn />}
        >
            <h2>Редагування визначення</h2>
            <Form
                form={form}
                onFinish={onSuccessfulSubmit}
                layout="vertical"
            >
                <FormItem
                    name="title"
                    label="Назва"
                    rules={[{ required: true, message: 'Введіть назву' }]}
                >
                    <Input showCount maxLength={50} />
                </FormItem>
                <FormItem
                    name="description"
                    label="Визначення"
                    rules={[{ required: true, message: 'Введіть опис' }]}
                >
                    <TextArea value={term?.description} />
                </FormItem>
                <Button className="streetcode-custom-button" onClick={() => form.submit()}>
                    Зберегти
                </Button>
            </Form>
        </Modal>
    );
};

export default observer(EditTermModal);
