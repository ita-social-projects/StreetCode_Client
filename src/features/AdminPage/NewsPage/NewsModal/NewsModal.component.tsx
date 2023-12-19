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
import axios from 'axios';
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

import Editor from '@/app/common/components/Editor/QEditor';
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
    initialValue: any;
    limit: any;
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
    const [count, setCount] = React.useState(0);
    const [textCount, setTextCount] = useState(0);
    const tooManyCharsMessage = 'Ви перевищили максимально допустиму кількість символів';
    const fillInAllFieldsMessage = "Будь ласка, заповніть всі обов'язкові поля";

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };
    const getNewsList = async () => {
        try {
            const response = await axios.get('/news/getAll');
            return response.data;
        } catch (error) {
            console.error('Помилка при отриманні списку новин', error);
            return [];
        }
    };

    const checkUniqueURL = async (url: string): Promise<boolean> => {
        const newsList = await getNewsList();
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

            if (editorRef.current?.editor) {
                const delta = editorRef.current.editor.clipboard.convert(newsItem.text);
                editorRef.current.editor.setContents(delta);
            }
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
        form.resetFields();
        setIsModalOpen(false);
        setTextIsPresent(false);
        editorRef.current?.editor?.setText('');
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    dayjs.locale('uk');
    const dayJsUa = require("dayjs/locale/uk"); // eslint-disable-line
    ukUAlocaleDatePicker.lang.shortWeekDays = dayJsUa.weekdaysShort;
    ukUAlocaleDatePicker.lang.shortMonths = dayJsUa.monthsShort;

    const handleTextChange = () => {
        setTextIsChanged(true);

        if (editorRef.current?.editor?.getText() === '') {
            setTextIsPresent(false);
            return false;
        }

        setTextIsPresent(true);
        return true;
    };

    const callErrorMessage = (messageText: string) => {
        message.config({
            top: 100,
            duration: 1,
            maxCount: 3,
            rtl: true,
            prefixCls: 'my-message',
        });
        message.error(messageText);
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            if (handleTextChange()) {
                form.submit();
                message.success('Новину успішно додано!', 2);
            } else {
                callErrorMessage(fillInAllFieldsMessage);
            }
        } catch (error) {
            callErrorMessage(fillInAllFieldsMessage);
        }
    };

    const onSuccessfulSubmitNews = async (formValues: any) => {
        const news: News = {
            id: 0,
            imageId: imageId.current,
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
        let success = false;
        if (newsItem) {
            news.id = newsItem.id;
            news.imageId = imageId.current;
            news.image = image.current;
            Promise.all([
                newsStore
                    .updateNews(news)
                    .then(() => {
                        success = true;
                    })
                    .catch((e) => {
                        console.log(e);
                        success = false;
                    }),
            ]);
        } else {
            Promise.all([
                newsStore
                    .createNews(news)
                    .then(() => {
                        success = true;
                    })
                    .catch((e) => {
                        console.log(e);
                        success = false;
                    }),
            ]);
        }
        if (success && afterSubmit) {
            afterSubmit(news);
        }
    };

    const handleUpdate = (value: any) => {
        const cCount = value.length;
        if (cCount <= sizeLimit) {
            setData(value);
            setCount(cCount);
            setTextCount(cCount);
        } else {
            callErrorMessage(tooManyCharsMessage);
        }
    };

    const handleBeforeAddUndo = (evt: any, editor: any) => {
        const cCount = editor.getContent({ format: 'text' }).length;
        if (cCount > sizeLimit) {
            evt.preventDefault();
        }
    };

    // useEffect(() => {
    //     editorRef.current = (
    //         <Editor
    //             qRef={editorRef}
    //             value={data}
    //             onChange={handleUpdate}
    //             maxChars={sizeLimit}
    //         />
    //     );
    // }, []);

    // useEffect(() => {
    //     const editor = editorRef?.current?.editor;
    //     if (editor) {
    //         const convertToDelta = editor.clipboard.convert(data);
    //         editorRef.current?.editor?.setContents(convertToDelta);
    //     }
    // }, [data]);

    return (
        <div>
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
                            />
                            <p>
                                Залишок символів:
                                {' '}
                                {sizeLimit - textCount}
                                {textCount > sizeLimit && (
                                    <span style={{ color: 'red', marginLeft: '10px' }}>
                                        {tooManyCharsMessage}
                                    </span>
                                )}

                            </p>
                            {!textIsPresent && textIsChanged && (
                                <p className="form-text">Введіть текст</p>
                            )}

                            <Form.Item
                                name="image"
                                label="Зображення: "
                                rules={[{ required: true, message: 'Додайте зображення' }]}
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
        </div>
    );
});
export default NewsModal;
