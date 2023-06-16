import '@features/AdminPage/AdminModal.styles.scss';

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
import Item from 'antd/es/list/Item';

import ImagesApi from '@/app/api/media/images.api';
import FactsApi from '@/app/api/streetcode/text-content/facts.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import getNewMinNegativeId from '@/app/common/utils/newIdForStore';
import Image from '@/models/media/image.model';
import { FactCreate } from '@/models/streetcode/text-contents.model';

interface Props {
    fact?: FactCreate,
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
                factContent: fact.factContent,
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
        const item: FactCreate = {
            id: getNewMinNegativeId(factsStore.getFactArray.map((f) => f.id)),
            title: inputedValues.title,
            factContent: inputedValues.factContent,
            imageId: imageId.current,
            imageDescription: inputedValues.imageDescription,
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
            className="modalContainer"
            open={open}
            onCancel={() => setModalOpen(false)}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <div className="modalContainer-content">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSuccesfulSubmit}
                >
                    <div className="center">
                        <h2>Wow—Факт</h2>
                    </div>
                    <Form.Item
                        name="title"
                        label="Заголовок: "
                        rules={[{ required: true, message: 'Введіть заголовок, будь ласка' },
                            { max: 68, message: 'Заголовок не може містити більше 68 символів ' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="factContent"
                        label="Основний текст: "
                        rules={[{ required: true, message: 'Введіть oсновний текст, будь ласка' }]}
                    >
                        <TextArea
                            value="Type"
                            maxLength={600}
                            showCount
                        />
                    </Form.Item>

                    <FormItem
                        label="Зображення"
                        name="image"
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
                        >
                            <div>
                                <InboxOutlined />
                                <p>+додати</p>
                            </div>
                        </FileUploader>
                    </FormItem>

                    <Form.Item
                        name="imageDescription"
                        label="Підпис фото: "
                    >
                        <TextArea
                            value="Type"
                            maxLength={100}
                            showCount
                        />
                    </Form.Item>


                    <div className="center">
                        <Button className="streetcode-custom-button" htmlType="submit">Зберегти</Button>
                    </div>

                </Form>
            </div>
        </Modal>
    );
};

export default observer(InterestingFactsAdminModal);
