/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import './NewsModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import useMobx from '@stores/root-store';
import { Editor } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';
import axios from 'axios';
import dayjs from 'dayjs';
import { Editor as TinyMCEEditor } from 'tinymce/tinymce';

import {
    Button,
    ConfigProvider,
    DatePicker,
    Form,
    Input,
    message, Modal,
    UploadFile,
} from 'antd';
import ukUAlocaleDatePicker from 'antd/es/date-picker/locale/uk_UA';
import ukUA from 'antd/locale/uk_UA';

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
}> = observer(({ newsItem, open, setIsModalOpen, afterSubmit }) => {
    const [form] = Form.useForm();
    const { newsStore } = useMobx();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [textIsPresent, setTextIsPresent] = useState<boolean>(false);
    const [textIsChanged, setTextIsChanged] = useState<boolean>(false);
    const imageId = useRef<number | undefined>(0);
    const editorRef = useRef<TinyMCEEditor>();

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
        if (newsItem && open) {
            imageId.current = newsItem.imageId;
            form.setFieldsValue({
                title: newsItem.title,
                url: newsItem.url,
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
            if (editorRef.current) {
                editorRef.current.setContent(newsItem.text);
            }
        } else {
            imageId.current = 0;
        }
    }, [newsItem, open, form]);
    const removeImage = () => {
        imageId.current = undefined;
        if (newsItem) {
            newsItem.image = undefined;
        }
    };

    const closeAndCleanData = () => {
        form.resetFields();
        setIsModalOpen(false);
        setTextIsPresent(false);
        setTextIsChanged(false);
        editorRef.current?.setContent('');
    };
    const localOffset = new Date().getTimezoneOffset() * 60000; // Offset in milliseconds
    dayjs.locale('uk');
  const dayJsUa = require("dayjs/locale/uk"); // eslint-disable-line
    ukUAlocaleDatePicker.lang.shortWeekDays = dayJsUa.weekdaysShort;
    ukUAlocaleDatePicker.lang.shortMonths = dayJsUa.monthsShort;
    const handleTextChange = () => {
        if (editorRef.current?.getContent() === '') {
            setTextIsPresent(false);
        } else {
            setTextIsPresent(true);
        }
        setTextIsChanged(true);
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
            handleTextChange();
            await form.validateFields();
            if (textIsPresent) {
                form.submit();
            } else {
                callErrorMessage("Будь ласка, заповніть всі обов'язкові поля");
            }
        } catch (error) {
            callErrorMessage("Будь ласка, заповніть всі обов'язкові поля");
        }
    };

    const onSuccessfulSubmitNews = async (formValues: any) => {
        const news: News = {
            id: 0,
            imageId: imageId.current,
            url: formValues.url,
            title: formValues.title,
            text: editorRef.current?.getContent() ?? '',
            image: undefined,
            creationDate: dayjs(formValues.creationDate).subtract(
                localOffset,
                'milliseconds',
            ),
        };

        let success = false;
        if (newsItem) {
            news.id = newsItem.id;
            news.imageId = imageId.current;
            news.image = newsItem.image;
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
        closeAndCleanData();
        if (success && afterSubmit) {
            afterSubmit(news);
        }
    };

    return (
        <div>
            <ConfigProvider locale={ukUA}>
                <Modal
                    open={open}
                    onCancel={closeAndCleanData}
                    className="modalContainer"
                    closeIcon={<CancelBtn />}
                    footer={null}
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
                                creationDate: newsItem ? dayjs(newsItem.creationDate) : dayjs(),
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
                                onEditorChange={handleTextChange}
                                onInit={(evt, editor) => {
                                    editorRef.current = editor;
                                }}
                                initialValue={newsItem ? newsItem.text : ''}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        'autolink',
                                        'lists',
                                        'preview',
                                        'anchor',
                                        'searchreplace',
                                        'visualblocks',
                                        'insertdatetime',
                                        'wordcount',
                                    ],
                                    // eslint-disable-next-line no-useless-concat
                                    toolbar: 'undo redo | bold italic | ' + 'removeformat ',
                                    content_style:
                    'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                                }}
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
                            >
                                <FileUploader
                                    multiple={false}
                                    accept=".jpeg,.png,.jpg"
                                    listType="picture-card"
                                    maxCount={1}
                                    onPreview={handlePreview}
                                    uploadTo="image"
                                    onSuccessUpload={(img: Image | Audio) => {
                                        imageId.current = img.id;
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
                            <Form.Item name="creationDate" label="Дата створення: ">
                                <DatePicker />
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
