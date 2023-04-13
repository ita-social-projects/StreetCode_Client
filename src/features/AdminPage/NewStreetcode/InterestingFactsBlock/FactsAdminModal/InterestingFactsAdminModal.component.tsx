import './InterestingFactsAdminModal.style.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

import {
    Button, Form, Input, Modal, Upload,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';

import { Fact } from '@/models/streetcode/text-contents.model';
import TextArea from 'antd/es/input/TextArea';
// import FactsStore from '@/app/stores/facts-store';

interface Props {
    fact?: Fact,
    open: boolean,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const InterestingFactsAdminModal = ({ fact, open, setModalOpen } : Props) => {
    const { factsStore } = useMobx();
    // const { setModal, modalsState: { adminFacts } } = modalStore;
    // const {  } = useMobx();
    const [form] = Form.useForm();

    // const [inputedFactContent, setFactContent] = useState('');

    // const characterCount = inputedFactContent.length | 0;

    useEffect(() => {
        if (fact && open) {
            form.setFieldsValue({
                title: fact.title,
                factContent: fact.factContent,
                image: fact.image,
            });
        }
    }, [fact, open, form]);

    const onSuccesfulSubmit = (inputedValues:any) => {
        if (fact) {
            const item = factsStore.factMap.get(fact.id);
            if (item) {
                // item.date = new Date(formValues.date);
                item.title = inputedValues.title;
                item.factContent = inputedValues.factContent;
                item.image = inputedValues.image;
            }
        } else {
            const newFact: Fact = {
                id: factsStore.factMap.size,
                title: inputedValues.title,
                factContent: inputedValues.factContent,
                image: inputedValues.image,
            };
            factsStore.addFact(newFact);
        }
        form.resetFields();
        setModalOpen(false);
    };

    return (
        <Modal
            className="interestingFactsAdminModal"
            open={open}
            onCancel={() => setModalOpen(false)}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <Form
                className="factForm"
                form={form}
                layout="vertical"
                onFinish={onSuccesfulSubmit}
            >
                <h2>Wow-Факт</h2>
                {/* <p>Заголовок</p>
                <div className="inputBlock">
                    <input /> */}
                <Form.Item
                    name="title"
                    className="inputBlock"
                    label="Заголовок: "
                    rules={[{ required: true, message: 'Введіть заголовок, будь ласка' },
                        { max: 30, message: 'Заголовок не може містити більше 30 символів ' },
                    ]}
                >
                    <Input className="title" />
                </Form.Item>
                {/* <p>Основний текст</p>
                    <textarea value={inputedFactContent} maxLength={600} onChange={(e) => setFactContent(e.target.value)} />
                */}
                  {/* <p className="characterCounter">
                        {characterCount}
                        /600
                    </p>  */}
                <Form.Item
                    name="factContent"
                    className="inputBlock"
                    label="Основний текст: "
                    // rules={[{ required: true, message: 'Введіть заголовок, будь ласка' }]}
                >
                    <TextArea
                        value="Type"
                        className="factContent"
                        // value={inputedFactContent}
                        maxLength={600}
                        // onChange={(e) => setFactContent(e.target.value)}
                        showCount
                    />
                    {/* <Form.Item className="characterCounter">
                    {characterCount}
                        /600

                    </Form.Item> */}
                    {/* <p className="characterCounter">
                        {characterCount}
                        /600
                    </p> */}
                </Form.Item>
                {/* </div> */}
                <p>Зображення:</p>
                <FormItem
                    name="image"
                    className=""
                >
                    <Upload
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                    >
                        <div className="upload">
                            <InboxOutlined />
                            <p>Виберіть чи перетягніть файл</p>
                        </div>
                    </Upload>
                </FormItem>
                <Button className="saveButton" htmlType="submit">Зберегти</Button>
            </Form>
        </Modal>
    );
};

export default observer(InterestingFactsAdminModal);
