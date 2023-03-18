import './InterestingFactsAdminModal.style.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';

import { Button, Form, Modal, Upload } from 'antd';
import FormItem from 'antd/es/form/FormItem';

interface Props {
    fact? : Fact
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const InterestingFactsModal = ({ fact, open, setOpen } : Props) => {
    const [factContent, setFactContent] = useState('');
    const [form] = Form.useForm();
    const { factsStore } = useMobx();

    useEffect(() => {
        if (fact && open) {
            form.setFieldsValue({
                title: fact.title,
                factContent: fact.factContent,
                imageId: fact.imageId,
            });
        }
    }, [fact, open, form]);

    // NOTE: somehow add fetching for new streetcode
    // useEffect(() => {
    //   factsStore.fetchAllStreetcode();
    // }, [some object]);

    const onSuccesfulSubmit = (formValues:any) => {
        if (fact) {
            const item = factsStore.factMap.get(fact.id); // timelineItemStore.timelineItemMap.get(timelineItem.id);
            if (item) {
                item.title = formValues.title;
                item.factContent = formValues.factContent;
                item.imageId = formValues.imageId;
            }
        } else {
            // FIX: figure out how to add streetcode here!
            const newFact: Fact = { id: factsStore.factMap.size,
                                    title: formValues.title,
                                    factContent: formValues.factContent,
                                    imageId: formValues.imageId };
            factsStore.addFactAdmin(newFact);

            setOpen(false);
            form.resetFields();
        }
    };
    const characterCount = factContent.length | 0;

    return (
        <Modal
            className="interestingFactsAdminModal"
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <Form className="factForm" onFinish={onSuccesfulSubmit}>
                <h2>Wow-Факт</h2>
                <p>Заголовок</p>
                <div className="inputBlock">
                    <input />
                    <p>Основний текст</p>
                    <textarea value={factContent} maxLength={600} onChange={(e) => setFactContent(e.target.value)} />
                    <p className="characterCounter">
                        {characterCount}
                        /600
                    </p>
                </div>
                <p>Зображення:</p>
                <FormItem
                    name="picture"
                    className=""
                    // rules={[{ required: true, message: 'Завантажте зображення' }]}
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

export default observer(InterestingFactsModal);
