import './InterestingFactsAdminModal.style.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

import {
    Button, Form, Input, Modal, Upload,
} from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import Image from '@/models/media/image.model';
import { Fact } from '@/models/streetcode/text-contents.model';

interface Props {
    fact?: Fact,
    open: boolean,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const InterestingFactsAdminModal = ({ fact, open, setModalOpen } : Props) => {
    const { factsStore } = useMobx();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedImage, setUploadedImage] = useState<Image | string >('src');
    const tempFile = fileList;

    useEffect(() => {
        if (fact && open) {
            form.setFieldsValue({
                id: fact.id,
                title: fact.title,
                factContent: fact.factContent,
                image: uploadedImage,
            });
            setFileList(tempFile);
        }
    }, [fact, open, fileList, form]);

    const onChange: UploadProps['onChange'] = ({ fileList: newFile }) => {
        newFile.forEach(async (x) => {
            let src = x.thumbUrl as string;
            if (!src) {
                src = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(x.originFileObj as RcFile);
                    reader.onload = () => resolve(reader.result as string);
                });
                setUploadedImage(src);
            }
        });
        setFileList(newFile);
    };

    const onSuccesfulSubmit = (inputedValues:any) => {
        if (fact) {
            const item = factsStore.factMap.get(fact.id);
            if (item) {
                item.title = inputedValues.title;
                item.factContent = inputedValues.factContent;
                item.image = uploadedImage;
            }
        } else {
            const newFact: Fact = {
                id: factsStore.factMap.size,
                title: inputedValues.title,
                factContent: inputedValues.factContent,
                image: uploadedImage,
            };
            setFileList([]);
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
                <Form.Item
                    name="factContent"
                    className="inputBlock"
                    label="Основний текст: "
                    rules={[{ required: true, message: 'Введіть oсновний текст, будь ласка' }]}
                >
                    <TextArea
                        value="Type"
                        className="factContent"
                        maxLength={600}
                        showCount
                    />
                </Form.Item>
                <p>Зображення:</p>
                <FormItem
                    name="image"
                    className=""
                >
                    <Upload
                        multiple={false}
                        fileList={fileList}
                        onChange={onChange}
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
