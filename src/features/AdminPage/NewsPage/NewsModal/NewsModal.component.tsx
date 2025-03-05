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
import combinedImageValidator, { checkFile } from '@components/modals/validators/combinedImageValidator';
import SubmitButton from '@components/SubmitButton.component';
import BUTTON_LABELS from '@constants/buttonLabels';
import { NEWS_TRANSLITERATION } from '@constants/regex.constants';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import useMobx from '@stores/root-store';
import dayjs from 'dayjs';

import {
    ConfigProvider,
    DatePicker,
    Form,
    Input,
    message, Modal,
    Popover,
    UploadFile,
} from 'antd';
import ukUAlocaleDatePicker from 'antd/es/date-picker/locale/uk_UA';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadFileStatus } from 'antd/es/upload/interface';
import ukUA from 'antd/locale/uk_UA';

import {
    checkQuillEditorTextLength,
    setQuillEditorContent,
} from '@/app/common/components/Editor/EditorUtilities/quillUtils.utility';
import Editor from '@/app/common/components/Editor/QEditor.component';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import uniquenessValidator from '@/app/common/utils/uniquenessValidator';
import Audio from '@/models/media/audio.model';
import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';

import POPOVER_CONTENT from '../../JobsPage/JobsModal/constants/popoverContent';

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
    const imageId = useRef<number | undefined>(0);
    const image = useRef<Image | undefined>(undefined);
    const editorRef = useRef<ReactQuill | null>(null);
    const sizeLimit = limit ?? 15000;
    const [data, setData] = React.useState(initialValue ?? '');
    const fillInAllFieldsMessage = "Будь ласка, заповніть всі обов'язкові поля правильно";
    const [actionSuccess, setActionSuccess] = useState(false);
    const [waitingForApiResponse, setWaitingForApiResponse] = useState(false);
    const [editorCharacterCount, setEditorCharacterCount] = useState<number>(0);
    const [removedImage, setRemovedImage] = useState<Image | undefined>(undefined);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

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

    const createFileListData = (img: Image) => {
        if (!newsItem || !img) {
            return [];
        }

        return [{
            name: '',
            url: base64ToUrl(img.base64, img.mimeType),
            thumbUrl: base64ToUrl(img.base64, img.mimeType),
            uid: newsItem!.imageId?.toString(),
            status: 'done' as UploadFileStatus,
            type: img.mimeType,
        }];
    };

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const checkUniqueURL = async (url: string): Promise<boolean> => {
        const newsList = newsStore.NewsArray;
        if (newsItem) {
            const filteredNewsList = newsList.filter((news: News) => news.id !== newsItem?.id);
            return filteredNewsList.every((news: News) => news.url !== url);
        }
        return newsList.every((news: News) => news.url !== url);
    };

    const validateTitle = uniquenessValidator(
        () => newsStore.NewsArray.map((news: News) => news.title.trim()),
        () => newsItem?.title?.trim(),
        'Заголовок вже існує',
    );

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
            setFileList(createFileListData(newsItem.image!));
        } else {
            imageId.current = 0;
            image.current = undefined;
        }
    }, [newsItem, open, form]);

    useEffect(() => {
        if (open) {
            const isEditorEmpty = editorRef.current?.editor?.getText().trim() === '';
            if (isEditorEmpty) {
                form.setFields([{ name: 'editor', errors: [] }]);
            } else {
                form.setFields([{ name: 'editor', errors: ['Введіть текст'] }]);
            }
        }
    }, [open]);

    const removeImage = () => {
        setRemovedImage(image.current);
        imageId.current = undefined;
        image.current = undefined;
        if (newsItem) {
            newsItem.image = undefined;
        }
        setFileList([]);
    };

    const closeAndCleanData = () => {
        if (!waitingForApiResponse) {
            form.resetFields();
            setFileList([]);
            setIsModalOpen(false);
            setRemovedImage(undefined);
            editorRef.current?.editor?.setText('');
        }
    };

    const closeModal = () => {
        if (!waitingForApiResponse) {
            setIsModalOpen(false);
            if (removedImage) {
                imageId.current = removedImage.id;
                image.current = removedImage;
                if (newsItem) {
                    newsItem.image = removedImage;
                }
                setRemovedImage(undefined);
            }
        }
    };

    dayjs.locale('uk');
    const dayJsUa = require("dayjs/locale/uk") // eslint-disable-line
    ukUAlocaleDatePicker.lang.shortWeekDays = dayJsUa.weekdaysShort;
    ukUAlocaleDatePicker.lang.shortMonths = dayJsUa.monthsShort;

    const handleOk = async () => {
        try {
            await form.validateFields();
            checkQuillEditorTextLength(editorCharacterCount, sizeLimit);
            setWaitingForApiResponse(true);
            form.submit();
        } catch {
            message.error(fillInAllFieldsMessage);
        }
    };

    const onSuccessfulSubmitNews = async (formValues: any) => {
        const hideLoadingMessage = message.loading('Зберігання...', 0);

        const news: News = {
            id: 0,
            imageId: imageId.current as number,
            url: formValues.url,
            title: formValues.title,
            text: data ?? '',
            image: formValues.image,
            creationDate: dayjs(formValues.creationDate),
        };
        newsStore.NewsArray.map((t) => t).forEach((t) => {
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
                await newsStore.updateNews(news);
            } else {
                await newsStore.createNews(news);
            }

            if (afterSubmit) {
                afterSubmit(news);
            }
            setActionSuccess(true);
            setRemovedImage(undefined);
        } catch (e: unknown) {
            message.error('Не вдалось оновити/створити новину. Спробуйте ще раз.');
            setWaitingForApiResponse(false);
        } finally {
            hideLoadingMessage();
        }
    };

    const handleUpdate = async (value: any) => {
        setData(value);
    };

    const handleFileChange = async (param: UploadChangeParam<UploadFile<unknown>>) => {
        if (await checkFile(param.file)) {
            setFileList(param.fileList);
            form.setFieldsValue({ image: fileList });
        }
    };

    const onSuccessFileUpload = async (img: Image | Audio) => {
        const newFileList = createFileListData(img as Image);
        form.setFieldsValue({ image: newFileList });
        imageId.current = img.id;
        image.current = img as Image;
        if (newsItem) {
            newsItem.image = img as Image;
            newsItem.imageId = img.id;
        }
    };

    return (
        <ConfigProvider locale={ukUA}>
            <Modal
                open={open}
                onCancel={closeModal}
                className="modalContainer"
                footer={null}
                closeIcon={(
                    <Popover content={POPOVER_CONTENT.CANCEL} trigger="hover">
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
                                новину
                            </h2>
                        </div>
                        <Form.Item
                            name="title"
                            label="Заголовок:"
                            rules={[
                                { required: true, message: 'Введіть заголовок' },
                                {
                                    validator: validateTitle,
                                },
                            ]}
                        >
                            <Input maxLength={100} showCount />
                        </Form.Item>

                        <Form.Item
                            name="url"
                            label="Транслітерація для URL: "
                            rules={[
                                { required: true, message: 'Введіть транслітерацію' },
                                {
                                    pattern: NEWS_TRANSLITERATION,
                                    message: 'Транслітерація має містити лише малі латинські літери, цифри та дефіс',
                                },
                                {
                                    validator: async (_, value) => {
                                        const isUnique = checkUniqueURL(value);

                                        if (await isUnique) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Транслітерація вже існує'));
                                    },

                                },
                            ]}
                        >
                            <Input maxLength={200} showCount />
                        </Form.Item>

                        <Form.Item
                            name="editor"
                            label="Текст:"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введіть текст',
                                    validator: () => {
                                        if (!data) {
                                            return Promise.reject(new Error('Введіть текст'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Editor
                                qRef={editorRef}
                                value={data}
                                onChange={handleUpdate}
                                maxChars={sizeLimit}
                                onCharacterCountChange={setEditorCharacterCount}
                            />
                        </Form.Item>

                        <Form.Item
                            name="image"
                            label="Зображення: "
                            className="image-form-item"
                            rules={[
                                { required: true, message: 'Додайте зображення' },
                                { validator: combinedImageValidator(true) },
                            ]}
                        >
                            <FileUploader
                                multiple={false}
                                accept=".jpeg,.png,.jpg,.webp"
                                listType="picture-card"
                                maxCount={1}
                                beforeUpload={checkFile}
                                onPreview={handlePreview}
                                fileList={fileList}
                                uploadTo="image"
                                onSuccessUpload={onSuccessFileUpload}
                                onRemove={removeImage}
                                defaultFileList={
                                    newsItem?.image ? createFileListData(newsItem.image) : []
                                }
                                onChange={handleFileChange}

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
                            <SubmitButton
                                form={form}
                                initialData={newsItem}
                                className="streetcode-custom-button"
                                onClick={() => handleOk()}
                            >
                                {BUTTON_LABELS.SAVE}
                            </SubmitButton>
                        </div>
                    </Form>
                </div>
            </Modal>
        </ConfigProvider>
    );
});

export default NewsModal;
