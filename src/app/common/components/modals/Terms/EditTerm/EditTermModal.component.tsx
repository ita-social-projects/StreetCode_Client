import './EditTermModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';

import { Button, Form, Input, Modal } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import { Term } from '@/models/streetcode/text-contents.model';

interface Props {
    handleEdit: (id: number, title: string, description: string | undefined) => void;
    term: Partial<Term> | undefined;
    setTerm: React.Dispatch<React.SetStateAction<Partial<Term> | undefined>>;
}

const EditTermModal = ({ handleEdit, term, setTerm } : Props) => {
    const { modalStore: { setModal, modalsState: { editTerm } } } = useMobx();

    const handleChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTerm({ ...term, description: e.target.value });
        console.log(term);
    };

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTerm({ ...term, title: e.target.value });
        console.log(term);
    };

    return (
        <Modal
            className="editModal"
            open={editTerm.isOpen}
            onCancel={() => setModal('editTerm')}
            footer={[
                <Button onClick={() => setModal('editTerm')}>
                    Відмінити
                </Button>,
                <Button
                    className="submit"
                    onClick={() => {
                        if (term !== null || undefined) {
                            handleEdit(term?.id as number, term?.title as string, term?.description);
                            setModal('editTerm');
                        }
                    }}
                >
                    Зберегти
                </Button>,
            ]}
            closeIcon={<CancelBtn />}
        >
            <h2>Редагування визначення</h2>
            <Form>
                <FormItem label="Назва">
                    <Input value={term?.title} onChange={handleChangeTitle} />
                </FormItem>
                <FormItem label="Визначення">
                    <TextArea value={term?.description} onChange={handleChangeDesc} />
                </FormItem>
            </Form>
        </Modal>
    );
};

export default observer(EditTermModal);
