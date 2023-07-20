import '@features/AdminPage/AdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import getNewMinNegativeId from '@app/common/utils/newIdForStore';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

import {
    Button, Form, Input, Modal, UploadFile,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import ImagesApi from '@/app/api/media/images.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import { Fact, FactCreate, FactUpdate } from '@/models/streetcode/text-contents.model';

import PreviewFileModal from '../../MainBlock/PreviewFileModal/PreviewFileModal.component';

interface Props {
    fact?: FactCreate,
    open: boolean,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onChange: (field: string, value: any) => void
}

const InterestingFactsAdminModal = ({ fact, open, setModalOpen, onChange }: Props) => {
    const { factsStore } = useMobx();
    const [form] = Form.useForm();
    const imageId = useRef<number>(0);
    const [fileList, setFileList] = useState<UploadFile[]>();
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    useEffect(() => {
        if (fact && open) {
            imageId.current = fact.imageId;
            form.setFieldsValue({
                title: fact.title,
                factContent: fact.factContent,
            });
            ImagesApi.getById(fact.imageId)
                .then((image) => {
                    fact.image = image;
                    form.setFieldsValue({
                        image: fact ? [{
                            name: '',
                            url: base64ToUrl(image.base64, image.mimeType),
                            thumbUrl: base64ToUrl(image.base64, image.mimeType),
                            uid: `${fact.id}`,
                            status: 'done',
                            type: image.mimeType,
                        }] : [],
                        imageDescription: image?.imageDetails?.alt ?? fact.imageDescription,
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

    const onSuccesfulSubmit = (formValues: any) => {
        if (fact) {
            const item = factsStore.factMap.get(fact.id) as FactUpdate;
            if (item) {
                item.title = formValues.title;
                item.factContent = formValues.factContent;
                item.imageId = imageId.current;
                item.imageDescription = formValues.imageDescription;
            }
            if (fact.image?.imageDetails || formValues.imageDescription) {
                factsStore.setImageDetails(item, fact.image?.imageDetails?.id ?? 0);
            }
        } else {
            const newFact: FactCreate = {
                id: getNewMinNegativeId(factsStore.getFactArray.map((t) => t.id)),
                title: formValues.title,
                factContent: formValues.factContent,
                imageId: imageId.current,
                imageDescription: formValues.imageDescription,
            };
            if (formValues.imageDescription) {
                factsStore.setImageDetails(newFact, 0);
            }

            factsStore.addFact(newFact);
        }
        setModalOpen(false);
        form.resetFields();
        onChange('fact', formValues);
    };

    return (
        <div>
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
                            <h2>Wow-Факт</h2>
                        </div>
                        <Form.Item
                            name="title"
                            label="Заголовок: "
                            rules={[{ required: true, message: 'Введіть заголовок, будь ласка' },
                                { max: 68, message: 'Заголовок не може містити більше 68 символів ' },
                            ]}
                        >
                            <Input onChange={(e) => onChange('title', e.target.value)} />
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
                                onChange={(e) => onChange('factContent', e.target.value)}
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
                                onPreview={(file) => {
                                    setPreviewOpen(true);
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
                            <Input
                                maxLength={100}
                                showCount
                                onChange={(e) => onChange('imageDescription', e.target.value)}
                            />
                        </Form.Item>
                        <div className="center">
                            <Button className="streetcode-custom-button" htmlType="submit"> Зберегти </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
            <PreviewFileModal file={fileList?.at(0) ?? null} opened={previewOpen} setOpened={setPreviewOpen} />
        </div>
    );
};
//1
export default observer(InterestingFactsAdminModal);
