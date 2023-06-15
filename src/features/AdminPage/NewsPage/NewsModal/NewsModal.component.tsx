import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import useMobx from '@stores/root-store';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';
import dayjs from 'dayjs';

import {
    Button, ConfigProvider, DatePicker, Form, Input, Modal, UploadFile,
} from 'antd';
import ukUAlocaleDatePicker from 'antd/es/date-picker/locale/uk_UA';
import ukUA from 'antd/locale/uk_UA';

import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';

const NewsModal:React.FC<{ newsItem?:News, open:boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, afterSubmit?:(news:News)=>void
 }> = observer(({ newsItem, open, setIsModalOpen, afterSubmit }) => {
     const [form] = Form.useForm();
     const { newsStore } = useMobx();
     const [previewOpen, setPreviewOpen] = useState(false);
     const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
     const [image, setImage] = useState<Image>();
     const imageId = useRef<number>(0);
     const editorRef = useRef<TinyMCEEditor>();
     const handlePreview = async (file: UploadFile) => {
         setFilePreview(file);
         setPreviewOpen(true);
     };
     useEffect(() => {
         if (newsItem && open) {
             imageId.current = newsItem.imageId;
             form.setFieldsValue({
                 title: newsItem.title,
                 url: newsItem.url,
                 image: [
                     { name: '',
                       thumbUrl: base64ToUrl(newsItem.image?.base64, newsItem.image?.mimeType),
                       uid: newsItem.imageId?.toString(),
                       status: 'done' }],
             });
             if (editorRef.current) {
                 editorRef.current.setContent(newsItem.text);
             }
         } else {
             imageId.current = 0;
         }
     }, [newsItem, open, form]);

     const closeAndCleanData = () => {
         form.resetFields();
         setIsModalOpen(false);
         editorRef.current.setContent('');
     };
     const localOffset = new Date().getTimezoneOffset() * 60000; // Offset in milliseconds
     dayjs.locale('uk');
     const dayJsUa = require("dayjs/locale/uk"); // eslint-disable-line
     ukUAlocaleDatePicker.lang.shortWeekDays = dayJsUa.weekdaysShort;
     ukUAlocaleDatePicker.lang.shortMonths = dayJsUa.monthsShort;
     const onSuccessfulSubmitNews = async (formValues:any) => {
         const news: News = {
             id: 0,
             imageId: imageId.current,
             url: formValues.url,
             title: formValues.title,
             text: editorRef.current.getContent(),
             image,
             creationDate: new Date(formValues.creationDate - localOffset),
         };

         let success = false;
         if (newsItem) {
             news.id = newsItem.id;
             news.imageId = imageId.current;
             news.image = newsItem.image;
             Promise.all([
                 newsStore.updateNews(news)
                     .then(() => {
                         success = true;
                     })
                     .catch((e) => {
                         console.log(e); success = false;
                     }),
             ]);
         } else {
             Promise.all([
                 newsStore.createNews(news)
                     .then(() => {
                         success = true;
                     })
                     .catch((e) => {
                         console.log(e); success = false;
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
                                 rules={[{ required: true, message: 'Введіть Посилання' },
                                     { pattern: /^[a-zA-Z-]+$/, message: 'Посилання має містити лише літерали' }
                                 ]}
                             >
                                 <Input maxLength={200} showCount />
                             </Form.Item>

                             <TinyMCEEditor
                                 onInit={(evt, editor) => {
                                     editorRef.current = editor;
                                 }}
                                 initialValue={newsItem ? newsItem.text : ''}
                                 init={{
                                     height: 300,
                                     menubar: false,
                                     plugins: [
                                         'autolink',
                                         'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                                         'insertdatetime', 'wordcount',
                                     ],
                                     toolbar: 'undo redo | bold italic | '
                                     + 'removeformat ',
                                     content_style: 'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                                 }}
                             />

                             <Form.Item
                                 name="image"
                                 label="Картинка"
                                 valuePropName="fileList"
                                 getValueFromEvent={(e: any) => {
                                     if (Array.isArray(e)) {
                                         return e;
                                     }
                                     return e?.fileList;
                                 }}
                             >
                                 <FileUploader
                                     multiple={false}
                                     accept=".jpeg,.png,.jpg"
                                     listType="picture-card"
                                     maxCount={1}
                                     onPreview={handlePreview}
                                     uploadTo="image"
                                     onSuccessUpload={(image:Image) => {
                                         imageId.current = image.id;
                                         setImage(image);
                                         if (newsItem) {
                                             newsItem.image = image;
                                         }
                                     }}
                                     onRemove={(image) => {
                                         setImage(undefined);
                                         if (newsItem) {
                                             newsItem.image = undefined;
                                         }
                                     }}
                                     defaultFileList={(newsItem)
                                         ? [{ name: '',
                                              thumbUrl: base64ToUrl(newsItem.image?.base64, newsItem.image?.mimeType),
                                              uid: newsItem.imageId?.toString(),
                                              status: 'done' }]
                                         : []}
                                 >
                                     <p>Виберіть чи перетягніть файл</p>
                                 </FileUploader>
                             </Form.Item>
                             <Form.Item
                                 name="creationDate"
                                 label="Дата створення: "
                             >
                                 <DatePicker />
                             </Form.Item>
                             <PreviewFileModal opened={previewOpen} setOpened={setPreviewOpen} file={filePreview} />
                             <div className="center">
                                 <Button className="streetcode-custom-button" onClick={() => form.submit()}>
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
