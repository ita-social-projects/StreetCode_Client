/* eslint-disable @typescript-eslint/no-explicit-any */
import './PartnerModal.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import useMobx from '@stores/root-store';

import {
    Button,
    Checkbox,
    Form, Input, Modal, Select, Upload, UploadFile,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import PartnerLink from '@/features/AdminPage/PartnersPage/PartnerLink.component';
import Partner, {
    LogoType,
    PartnerCreateUpdate, PartnerSourceLinkCreateUpdate,
} from '@/models/partners/partners.model';
import { StreetcodeShort } from '@/models/streetcode/streetcode-types.model';

const PartnerModal:React.FC<{ partnerItem?:Partner, open:boolean, isStreetcodeVisible?:boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, afterSubmit?:(partner:PartnerCreateUpdate)=>void
 }> = observer(({
     partnerItem, open, setIsModalOpen, isStreetcodeVisible = true, afterSubmit,
 }) => {
     const [form] = Form.useForm();
     const { partnersStore, streetcodeShortStore } = useMobx();
     const [partnerLinksForm] = Form.useForm();
     const [previewOpen, setPreviewOpen] = useState(false);
     const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
     const [customWarningVisible, setCustomWarningVisible] = useState<boolean>(false);
     const selectedStreetcodes = useRef<StreetcodeShort[]>([]);
     const [partnerSourceLinks, setPartnersSourceLinks] = useState<PartnerSourceLinkCreateUpdate[]>([]);
     const handlePreview = async (file: UploadFile) => {
         setFilePreview(file);
         setPreviewOpen(true);
     };
     const onStreetcodeSelect = (value:string) => {
         const index = streetcodeShortStore.streetcodes.findIndex((c) => c.title === value);
         selectedStreetcodes.current.push(streetcodeShortStore.streetcodes[index]);
     };
     const onStreetcodeDeselect = (value:string) => {
         selectedStreetcodes.current = selectedStreetcodes.current.filter((c) => c.title !== value);
     };
     useEffect(() => {
         if (isStreetcodeVisible) {
             streetcodeShortStore.fetchStreetcodesAll();
         }
     }, []);
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
                     { name: '',
                       url: base64ToUrl(partnerItem.logo?.base64, partnerItem.logo?.mimeType),
                       uid: partnerItem.logoId.toString(),
                       status: 'done' }],
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
         selectedStreetcodes.current = [];
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
         partnerSourceLinks.forEach((el, index) => {
             if (el.id < 0) {
                 partnerSourceLinks[index].id = 0;
             }
             partnerSourceLinks[index].title = 'title';
         });
         const partner: PartnerCreateUpdate = {
             id: 0,
             isKeyPartner: formValues.isKeyPartner,
             logoId: 0,
             partnerSourceLinks,
             streetcodes: selectedStreetcodes.current,
             targetUrl: formValues.url,
             title: formValues.title,
             description: formValues.description,
             urlTitle: formValues.urlTitle,
             isVisibleEverywhere: false,
         };
         let success = false;
         if (partnerItem) {
             partner.id = partnerItem.id;
             partner.logoId = partnerItem.logoId;
             Promise.all([
                 partnersStore.updatePartner(partner)
                     .then(() => {
                         success = true;
                     })
                     .catch((e) => {
                         console.log(e); success = false;
                     }),
             ]);
         } else {
             Promise.all([
                 partnersStore.createPartner(partner)
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
             afterSubmit(partner);
         }
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
                 <div className="form-input-line-group">

                     <Form.Item
                         labelCol={{ span: 20 }}
                         wrapperCol={{ span: 27 }}
                         name="isKeyPartner"
                         label="Ключовий партнер: "
                         valuePropName="checked"
                     >
                         <Checkbox />
                     </Form.Item>

                     <Form.Item
                         labelCol={{ span: 20 }}
                         wrapperCol={{ span: 27 }}
                         name="isVisibleEverywhere"
                         label="Видимий для всіх: "
                         valuePropName="checked"
                     >
                         <Checkbox />
                     </Form.Item>
                 </div>

                 <Form.Item
                     name="title"
                     label="Назва: "
                     rules={[{ required: true, message: 'Введіть назву' }]}
                 >
                     <Input maxLength={100} showCount />
                 </Form.Item>

                 <Form.Item
                     name="url"
                     label="Посилання: "
                 >
                     <Input maxLength={200} showCount />
                 </Form.Item>

                 <Form.Item
                     name="urlTitle"
                     label="Назва посилання: "
                     className="url-title"
                 >
                     <Input maxLength={100} showCount />
                 </Form.Item>

                 <Form.Item
                     name="description"
                     label="Опис: "
                 >
                     <TextArea showCount maxLength={450} />
                 </Form.Item>

                 <Form.Item
                     name="logo"
                     className="maincard-item photo-form-item"
                     label="Лого"
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
                         className="uploader-small"
                         uploadTo="image"
                         fileList={(partnerItem)
                             ? [{ name: '',
                                  url: base64ToUrl(partnerItem.logo?.base64, partnerItem.logo?.mimeType),
                                  uid: partnerItem.logoId.toString(),
                                  status: 'done' }]
                             : []}
                         defaultFileList={(partnerItem)
                             ? [{ name: '',
                                  url: base64ToUrl(partnerItem.logo?.base64, partnerItem.logo?.mimeType),
                                  uid: partnerItem.logoId.toString(),
                                  status: 'done' }]
                             : []}
                     >
                         <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                     </FileUploader>
                 </Form.Item>
                 <PreviewFileModal opened={previewOpen} setOpened={setPreviewOpen} file={filePreview} />

                 {isStreetcodeVisible ? (
                     <Form.Item name="partnersStreetcodes" label="Стріткоди: ">
                         <Select
                             mode="multiple"
                             onSelect={onStreetcodeSelect}
                             onDeselect={onStreetcodeDeselect}
                         >
                             {streetcodeShortStore.streetcodes
                                 .map((s) => <Select.Option key={`${s.id}`} value={s.title}>{s.title}</Select.Option>)}
                         </Select>
                     </Form.Item>
                 ) : ''}

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
                         <Input min={1} max={255} showCount />
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
