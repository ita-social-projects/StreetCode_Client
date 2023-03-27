/* eslint-disable @typescript-eslint/no-explicit-any */
import './PartnerModal.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
// eslint-disable-next-line no-restricted-imports
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';

import {
    Button,
    Checkbox,
    Form, Input, Modal, Select, Upload, UploadFile,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { Option } from 'antd/es/mentions';

// eslint-disable-next-line import/extensions
import useMobx from '@/app/stores/root-store';
// eslint-disable-next-line import/extensions
import StreetcodeShortStore from '@/app/stores/streetcodeshort-store';
import Partner, {
    LogoType,
    PartnerCreateUpdate, PartnerSourceLinkCreateUpdate,
} from '@/models/partners/partners.model';
import { StreetcodeShort } from '@/models/streetcode/streetcode-types.model';

// eslint-disable-next-line no-restricted-imports
import PartnerLink from '../PartnerLink.component';

const PartnerModal:React.FC<{ partnerItem?:Partner, open:boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
 }> = observer(({ partnerItem, open, setIsModalOpen }) => {
     const [form] = Form.useForm();
     const { partnersStore } = useMobx();
     const [partnerLinksForm] = Form.useForm();
     const [previewOpen, setPreviewOpen] = useState(false);
     const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
     const [customWarningVisible, setCustomWarningVisible] = useState<boolean>(false);
     const selectedStreetcodes = useRef<StreetcodeShort[]>([]);
     const [partnerSourceLinks, setPartnersSourceLinks] = useState<PartnerSourceLinkCreateUpdate[]>([]);
     const streetcodeStore = StreetcodeShortStore;
     const handlePreview = async (file: UploadFile) => {
         setFilePreview(file);
         setPreviewOpen(true);
     };
     const onStreetcodeSelect = (value:string) => {
         const index = streetcodeStore.streetcodes.findIndex((c) => c.title === value);
         selectedStreetcodes.current.push(streetcodeStore.streetcodes[index]);
     };
     const onStreetcodeDeselect = (value:string) => {
         selectedStreetcodes.current = selectedStreetcodes.current.filter((c) => c.title !== value);
     };
     useEffect(() => {
         streetcodeStore.fetchStreetcodesAll();
     }, [streetcodeStore]);
     useEffect(() => {
         if (partnerItem && open) {
             console.log(partnerItem);
             form.setFieldsValue({
                 title: partnerItem.title,
                 isKeyPartner: partnerItem.isKeyPartner,
                 url: partnerItem.targetUrl.href,
                 urlTitle: partnerItem.targetUrl.title,
                 description: partnerItem.description,
                 partnersStreetcodes: partnerItem.streetcodes.map((s) => s.title),
                 logo: [
                     { name: '', url: partnerItem.logo?.url.href, uid: partnerItem.logoId.toString(), status: 'done' }],
             });
             selectedStreetcodes.current = partnerItem.streetcodes;
             setPartnersSourceLinks(partnerItem.partnerSourceLinks.map((l) => ({
                 id: l.id,
                 logoType: l.logoType,
                 targetUrl: l.targetUrl.href,
                 title: l.title,

             })));
         }
     }, [partnerItem, open, form]);

     const closeAndCleanData = () => {
         form.resetFields();
         partnerLinksForm.resetFields();
         selectedStreetcodes.current.splice(0);
         partnerSourceLinks.splice(0);
         setIsModalOpen(false);
     };

     const onSuccesfulSubmitLinks = (formValues:any) => {
         const url = formValues.url as string;
         const logotype = partnerLinksForm.getFieldValue('logotype');
         if (!url.toLocaleLowerCase().includes(logotype)) {
             setCustomWarningVisible(true);
         } else {
             setCustomWarningVisible(false);
             let newId = Math.min(...partnerSourceLinks.map((item) => item.id));
             if (newId < 0) {
                 newId -= 1;
             } else {
                 newId = -1;
             }
             setPartnersSourceLinks([...partnerSourceLinks, { id: newId,
                                                              logoType: Number(LogoType[logotype]),
                                                              targetUrl: url,
                                                              title: 'title' }]);
         }
     };
     const onSuccesfulSubmitPartner = async (formValues:any) => {
         console.log(formValues);
         partnerSourceLinks.forEach((el, index) => {
             if (el.id < 0) {
                 partnerSourceLinks[index].id = 0;
             }
             partnerSourceLinks[index].title = 'title';
         });
         const partner: PartnerCreateUpdate = { id: 0,
                                                isKeyPartner: formValues.isKeyPartner,
                                                logoBase64: 'base5',
                                                logoId: 0,
                                                partnerSourceLinks,
                                                streetcodes: selectedStreetcodes.current,
                                                targetUrl: formValues.url,
                                                title: formValues.title,
                                                description: formValues.description,
                                                urlTitle: formValues.urlTitle };
         if (partnerItem) {
             partner.id = partnerItem.id;
             partner.logoId = partnerItem.logoId;
             partnersStore.updatePartner(partner).catch((e) => console.log(e));
         } else {
             console.log(partner);
             partnersStore.createPartner(partner).catch((e) => console.log(e));
         }
         closeAndCleanData();
     };

     const selectSocialMediaOptions = [{
         value: 'twitter',
         label: 'Twitter',
     }, {
         value: 'instagram',
         label: 'Instagram',
     }, {
         value: 'facebook',
         label: 'Facebook',
     }, {
         value: 'youtube',
         label: 'Youtube',
     }];
     return (
         <Modal
             title={partnerItem ? 'Редагувати' : 'Додати'}
             open={open}
             onCancel={closeAndCleanData}
             className="partner-modal"
             footer={[
                 <Button className="streetcode-custom-button" onClick={() => form.submit()}>
                        Зберегти
                 </Button>]}
         >
             <Form
                 form={form}
                 labelCol={{ span: 7 }}
                 wrapperCol={{ span: 18 }}
                 className="partner-form"
                 onFinish={onSuccesfulSubmitPartner}
             >
                 <Form.Item
                     name="isKeyPartner"
                     label="Ключовий партнер: "
                     valuePropName="checked"
                 >
                     <Checkbox />
                 </Form.Item>

                 <Form.Item
                     name="title"
                     label="Назва: "
                     rules={[{ required: true, message: 'Введіть назву' }]}
                 >
                     <Input />
                 </Form.Item>

                 <Form.Item
                     name="url"
                     label="Посилання: "
                     rules={[{ required: true, message: 'Введіть назву' }]}
                 >
                     <Input />
                 </Form.Item>

                 <Form.Item
                     name="urlTitle"
                     label="Назва посилання: "
                     className="url-title"
                     rules={[{ required: true, message: 'Введіть назву посилання' }]}
                 >
                     <Input />
                 </Form.Item>

                 <Form.Item
                     name="description"
                     label="Опис: "
                     rules={[{ required: true, message: 'Введіть назву' }]}
                 >
                     <TextArea showCount maxLength={450} />
                 </Form.Item>

                 <Form.Item
                     name="logo"
                     className="maincard-item photo-form-item"
                     label="Лого"
                     rules={[{ required: true, message: 'Завантажте зображення' }]}
                     valuePropName="fileList"
                     getValueFromEvent={(e: any) => {
                         if (Array.isArray(e)) {
                             return e;
                         }
                         return e?.fileList;
                     }}
                 >
                     <Upload
                         multiple={false}
                         accept=".jpeg,.png,.jpg"
                         listType="picture-card"
                         maxCount={1}
                         onPreview={handlePreview}
                         className="uploader-small"
                         fileList={(partnerItem)
                             ? [{ name: '',
                                  url: partnerItem.logo?.url.href,
                                  uid: partnerItem.logoId.toString(),
                                  status: 'done' }]
                             : []}
                         defaultFileList={(partnerItem)
                             ? [{ name: '',
                                  url: partnerItem.logo?.url.href,
                                  uid: partnerItem.logoId.toString(),
                                  status: 'done' }]
                             : []}
                     >
                         <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                     </Upload>
                 </Form.Item>
                 <PreviewFileModal opened={previewOpen} setOpened={setPreviewOpen} file={filePreview} />

                 <Form.Item name="partnersStreetcodes" label="Стріткоди: ">
                     <Select
                         mode="multiple"
                         onSelect={onStreetcodeSelect}
                         onDeselect={onStreetcodeDeselect}
                     >
                         {streetcodeStore.streetcodes.map((s) => <Option key={`${s.id}`} value={s.title} />)}
                     </Select>
                 </Form.Item>
             </Form>

             <Form
                 layout="vertical"
                 form={partnerLinksForm}
                 onFinish={onSuccesfulSubmitLinks}
             >
                 <div className="partner-source-list">

                     {partnerSourceLinks.map((link) => (
                         <div
                             className="partner-source-list-item"
                             key={`${link.id}${link.logoType}`}
                         >
                             <PartnerLink link={link} />
                             <p className="link-item">{link.targetUrl}</p>
                             <DeleteOutlined
                                 onClick={() => setPartnersSourceLinks(partnerSourceLinks
                                     .filter((l) => l.id !== link.id))}
                             />
                         </div>
                     ))}
                 </div>
                 <div className="partner-source-inputs-container">
                     <FormItem
                         name="logotype"
                         label="Соціальна мережа"
                         rules={[{ required: true, message: 'Виберіть соц. мережу' }]}
                     >
                         <Select
                             options={selectSocialMediaOptions}
                         />
                     </FormItem>
                     <Form.Item
                         className="url-input"
                         name="url"
                         rules={[{ required: true, message: 'Введіть посилання' }]}
                     >
                         <Input min={1} max={300} />
                     </Form.Item>

                     <Form.Item>
                         <Button htmlType="submit">
                             <UserAddOutlined />
                         </Button>
                     </Form.Item>
                 </div>
                 {customWarningVisible ? <p className="red-text">Посилання не співпадає з вибраним текстом</p> : ''}
             </Form>
         </Modal>
     );
 });
export default PartnerModal;
