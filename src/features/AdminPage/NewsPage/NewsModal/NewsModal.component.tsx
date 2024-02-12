/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable complexity */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import './NewsModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import useMobx from '@stores/root-store';
import dayjs from 'dayjs';

import {
    Button,
    ConfigProvider,
    DatePicker,
    Form,
    Input,
    message, Modal,
    Popover,
    UploadFile,
} from 'antd';
import ukUAlocaleDatePicker from 'antd/es/date-picker/locale/uk_UA';
import ukUA from 'antd/locale/uk_UA';

import {
    checkQuillEditorTextLength,
    setQuillEditorContent,
} from '@/app/common/components/Editor/EditorUtilities/quillUtils.utility';
import Editor from '@/app/common/components/Editor/QEditor.component';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Audio from '@/models/media/audio.model';
import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';

const NewsModal: React.FC<{
    newsItem?: News;
    open: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    afterSubmit?: (news: News) => void;
    initialValue?: any;
    limit?: any;
}> = observer(({
    newsItem, open, setIsModalOpen, afterSubmit, initialValue, limit,
}) => {
    const [form] = Form.useForm();
    const { newsStore } = useMobx();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [textIsPresent, setTextIsPresent] = useState<boolean>(false);
    const [textIsChanged, setTextIsChanged] = useState<boolean>(false);
    const imageId = useRef<number | undefined>(0);
    const image = useRef<Image | undefined>(undefined);
    const editorRef = useRef<ReactQuill>(null);
    const sizeLimit = limit ?? 15000;
    const [data, setData] = React.useState(initialValue ?? '');
    const fillInAllFieldsMessage = "Будь ласка, заповніть всі обов'язкові поля правильно";
    const [actionSuccess, setActionSuccess] = useState(false);
    const [waitingForApiResponse, setWaitingForApiResponse] = useState(false);
    const [editorCharacterCount, setEditorCharacterCount] = useState<number>(0);

    message.config({
        top: 100,
        duration: 2,
        maxCount: 3,
        prefixCls: 'my-message',
    });

    useEffect(() => {
        setWaitingForApiResponse(false);
        if (actionSuccess) {
            message.success('Новину успішно додано/оновлено!', 2);
            setActionSuccess(false);
        }
    }, [actionSuccess]);
    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const checkUniqueURL = async (url: string): Promise<boolean> => {
        const newsList = newsStore.getNewsArray;
        if (newsItem) {
            const filteredNewsList = newsList.filter((news: News) => news.id !== newsItem.id);
            return filteredNewsList.every((news: News) => news.url !== url);
        }
        return newsList.every((news: News) => news.url !== url);
    };

    useEffect(() => {
        editorRef.current?.editor?.setText('');
        if (newsItem && open) {
            imageId.current = newsItem.imageId;
            image.current = newsItem.image;
            form.setFieldsValue({
                title: newsItem.title,
                url: newsItem.url,
                creationDate: dayjs(newsItem.creationDate),
                image: newsItem.image ? [
                    {
                        name: '',
                        thumbUrl: base64ToUrl(
                            newsItem.image?.base64,
                            newsItem.image?.mimeType,
                        ),
                        uid: newsItem.imageId?.toString(),
                        status: 'done',
                    },
                ] : [],
            });
            setQuillEditorContent(editorRef.current, newsItem.text);
            setData(newsItem.text);
        } else {
            imageId.current = 0;
            image.current = undefined;
        }
    }, [newsItem, open, form]);

    const removeImage = () => {
        imageId.current = undefined;
        image.current = undefined;
        if (newsItem) {
            newsItem.image = undefined;
        }
    };

    const closeAndCleanData = () => {
        if (!waitingForApiResponse) {
            form.resetFields();
            setIsModalOpen(false);
            setTextIsPresent(false);
            setTextIsChanged(false);
            editorRef.current?.editor?.setText('');
        }
    };

    const closeModal = () => {
        if (!waitingForApiResponse) {
            setIsModalOpen(false);
        }
    };

    dayjs.locale('uk');
    const dayJsUa = require("dayjs/locale/uk") // eslint-disable-line
    ukUAlocaleDatePicker.lang.shortWeekDays = dayJsUa.weekdaysShort;
    ukUAlocaleDatePicker.lang.shortMonths = dayJsUa.monthsShort;

    const handleTextChange = () => {
        setTextIsChanged(true);
        const emptyTextField = editorRef.current?.editor?.getText().trim() === '';

        if (emptyTextField) {
            setTextIsPresent(false);
            return false;
        }

        setTextIsPresent(true);
        return true;
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            checkQuillEditorTextLength(editorCharacterCount, sizeLimit);
            if (handleTextChange()) {
                setWaitingForApiResponse(true);
                await form.submit();
            } else {
                throw new Error();
            }
        } catch {
            message.error(fillInAllFieldsMessage);
        }
    };

    const onSuccessfulSubmitNews = async (formValues: any) => {
        message.loading('Зберігання...');

        const news: News = {
            id: 0,
            imageId: imageId.current as number,
            url: formValues.url,
            title: formValues.title,
            text: data ?? '',
            image: undefined,
            creationDate: dayjs(formValues.creationDate),
        };
        newsStore.getNewsArray.map((t) => t).forEach((t) => {
            if (formValues.title == t.title || imageId.current == t.imageId) newsItem = t;
        });
        // need to fix when url is static because from didn't see ti when u press save button on second time
        try {
            if (!image.current) {
                throw new Error("Image isn't uploaded yet");
            }
            if (newsItem) {
                news.id = newsItem.id;
                news.imageId = imageId.current as number;
                news.image = image.current;

                await newsStore.updateNews(news);
            } else {
                await newsStore.createNews(news);
            }

            if (afterSubmit) {
                afterSubmit(news);
            }
            setActionSuccess(true);
        } catch (e: unknown) {
            message.error('Не вдалось оновити/створити новину. Спробуйте ще раз.');
            setWaitingForApiResponse(false);
        }
    };

    const handleUpdate = (value: any) => {
        setData(value);
    };

    return (
        <ConfigProvider locale={ukUA}>
            <Modal
                open={open}
                onCancel={closeModal}
                className="modalContainer"
                footer={null}
                closeIcon={(
                    <Popover content="Внесені зміни не будуть збережені!" trigger="hover">
                        <CancelBtn className="iconSize" onClick={closeAndCleanData} />
                    </Popover>
                )}
            >
                <div className="modalContainer-content">
                    <Form
                        scrollToFirstError
                        form={form}
                        layout="vertical"
                        onFinish={onSuccessfulSubmitNews}
                        initialValues={{
                            title: newsItem?.title,
                            url: newsItem?.url,
                            creationDate: newsItem ? dayjs(newsItem.creationDate) : undefined,
                        }}
                    >
                        <div className="center">
                            <h2>
                                {newsItem ? 'Редагувати' : 'Додати'}
                                {' '}
                                Новину
                            </h2>
                        </div>
                        <Form.Item
                            name="title"
                            label="Заголовок: "
                            rules={[{ required: true, message: 'Введіть заголовок' }]}
                        >
                            <Input maxLength={100} showCount />
                        </Form.Item>

                        <Form.Item
                            name="url"
                            label="Посилання: "
                            rules={[
                                { required: true, message: 'Введіть Посилання' },
                                {
                                    pattern: /^[a-z-]+$/,
                                    message:
                                        'Посилання має містити лише малі латинські літери та дефіс',
                                },
                                {
                                    validator: async (_, value) => {
                                        const isUnique = checkUniqueURL(value);

                                        if (await isUnique) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Посилання вже існує'));
                                    },

                                },
                            ]}
                        >
                            <Input maxLength={200} showCount />
                        </Form.Item>

                        <div className="required-text" title="Текст:">
                            <span className="star">&#x204E;</span>
                            <span>Текст:</span>
                        </div>
                        <Editor
                            qRef={editorRef}
                            value={data}
                            onChange={handleUpdate}
                            maxChars={sizeLimit}
                            onCharacterCountChange={setEditorCharacterCount}
                        />
                        {!textIsPresent && textIsChanged && (
                            <p className="form-text">Введіть текст</p>
                        )}

                        <Form.Item
                            name="image"
                            label="Зображення: "
                            valuePropName="fileList"
                            getValueFromEvent={(e: any) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e?.fileList;
                            }}
                            className="image-form-item"
                            rules={[{
                                required: true,
                                message: 'Додайте зображення',
                            },
                            {
                                validator: (_, file) => {
                                    if (file) {
                                        let name = '';
                                        if (file.file) {
                                            name = file.file.name.toLowerCase();
                                        } else if (file.name) {
                                            name = file.name.toLowerCase();
                                        }
                                        if (name.endsWith('.jpeg') || name.endsWith('.png')
                                            || name.endsWith('.webp') || name.endsWith('.jpg') || name === '') {
                                            return Promise.resolve();
                                        }
                                        // eslint-disable-next-line max-len
                                        return Promise.reject(Error('Тільки файли з розширенням webp, jpeg, png, jpg дозволені!'));
                                    }
                                    return Promise.reject();
                                },
                            },
                            ]}
                        >
                            <FileUploader
                                multiple={false}
                                accept=".jpeg,.png,.jpg,.webp"
                                listType="picture-card"
                                maxCount={1}
                                onPreview={handlePreview}
                                uploadTo="image"
                                onSuccessUpload={(img: Image | Audio) => {
                                    imageId.current = img.id;
                                    image.current = img as Image;
                                    if (newsItem) {
                                        newsItem.image = img as Image;
                                    }
                                }}
                                onRemove={removeImage}
                                defaultFileList={
                                    newsItem?.imageId != null
                                        ? [
                                            {
                                                name: '',
                                                thumbUrl: base64ToUrl(
                                                    newsItem?.image?.base64,
                                                    newsItem?.image?.mimeType,
                                                ),
                                                uid: newsItem?.imageId?.toString() || '',
                                                status: 'done',
                                            },
                                        ]
                                        : []
                                }

                            >
                                <p>Виберіть чи перетягніть файл</p>
                            </FileUploader>
                        </Form.Item>

                        <Form.Item
                            name="creationDate"
                            label="Дата створення: "
                            rules={[{ required: true, message: 'Введіть дату' }]}
                        >
                            <DatePicker showTime allowClear={false} />
                        </Form.Item>
                        <PreviewFileModal
                            opened={previewOpen}
                            setOpened={setPreviewOpen}
                            file={filePreview}
                        />

                        <div className="center">
                            <Button
                                className="streetcode-custom-button"
                                onClick={() => handleOk()}
                            >
                                Зберегти
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </ConfigProvider>
    );
});
export default NewsModal;
