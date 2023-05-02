import './InterestingFactsAdminModal.style.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

import {
    Button, Form, Input, Modal, UploadFile,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import ImagesApi from '@/app/api/media/images.api';
import FactsApi from '@/app/api/streetcode/text-content/facts.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import { Fact } from '@/models/streetcode/text-contents.model';
import Item from 'antd/es/list/Item';

interface Props {
    fact?: Fact,
    open: boolean,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const InterestingFactsAdminModal = ({ fact, open, setModalOpen }: Props) => {
    const { factsStore } = useMobx();
    const [form] = Form.useForm();
    const imageId = useRef<number>(0);
    const [fileList, setFileList] = useState<UploadFile[]>();

    useEffect(() => {
        if (fact && open) {
            imageId.current = fact.imageId;
            form.setFieldsValue({
                title: fact.title,
                factContent: fact.factContent
            });
            ImagesApi.getById(fact.imageId)
                .then((image) => {
                    form.setFieldsValue({
                        image: fact ? [{
                            name: '',
                            url: base64ToUrl(image.base64, image.mimeType),
                            thumbUrl: base64ToUrl(image.base64, image.mimeType),
                            uid: `${fact.id}`,
                            status: 'done',
                            type: image.mimeType,
                        }] : [],

                    });
                    setFileList(fact ? [{
                        name: '',
                        url: base64ToUrl(image.base64, image.mimeType),
                        thumbUrl: base64ToUrl(image.base64, image.mimeType),
                        uid: `${fact.id}`,
                        status: 'done',
                        type: image.mimeType,
                    }] : []);
                });
        } else {
            setFileList([]);
        }
    }, [fact, open, form]);

    const onSuccesfulSubmit = (inputedValues: any) => {
        const item: Fact = {
            id: factsStore.factMap.size,
            title: inputedValues.title,
            factContent: inputedValues.factContent,
            imageId: imageId.current,
        };
        if (fact) {
            item.id = fact.id;
            factsStore.updateFactInMap(item);
        } else {
            factsStore.addFact(item);
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
                    getValueFromEvent={(e: any) => {
                        if (Array.isArray(e)) {
                            return e;
                        }
                        return e?.fileList;
                    }}
                    rules={[{ required: true, message: 'Завантажте фото, будь ласка' }]}
                >
                    <FileUploader
                        onChange={(param) => {
                            setFileList(param.fileList);
                        }}
                        uploadTo="image"
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        fileList={fileList}
                        onSuccessUpload={(image: Image) => {
                            imageId.current = image.id;
                        }}
                        onRemove={(image) => {
                            ImagesApi.delete(imageId.current);
                        }}
                    >
                        <div className="upload">
                            <InboxOutlined />
                            <p>Виберіть чи перетягніть файл</p>
                        </div>
                    </FileUploader>
                </FormItem>
                <Button className="saveButton" htmlType="submit">Зберегти</Button>
            </Form>
        </Modal>
    );
};

export default observer(InterestingFactsAdminModal);