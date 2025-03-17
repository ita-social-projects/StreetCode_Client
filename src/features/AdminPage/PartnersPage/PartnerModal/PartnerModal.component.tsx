/* eslint-disable no-param-reassign,import/extensions */
import './PartnerModal.styles.scss';
import '@features/AdminPage/AdminModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import combinedImageValidator, { checkFile } from '@components/modals/validators/combinedImageValidator';
import BUTTON_LABELS from '@constants/buttonLabels';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import SOCIAL_OPTIONS from '@features/AdminPage/PartnersPage/PartnerModal/constants/socialOptions';
import useMobx from '@stores/root-store';

import {
    Button, Checkbox, Form, Input, message,
    Modal, Popover, Select, UploadFile,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { UploadChangeParam } from 'antd/es/upload';

import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import validateSocialLink from '@/app/common/components/modals/validators/socialLinkValidator';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import uniquenessValidator from '@/app/common/utils/uniquenessValidator';
import PartnerLink from '@/features/AdminPage/PartnersPage/PartnerLink.component';
import Audio from '@/models/media/audio.model';
import Image from '@/models/media/image.model';
import Partner, {
    LogoType,
    PartnerCreateUpdate,
    PartnerSourceLinkCreateUpdate,
} from '@/models/partners/partners.model';
import { StreetcodeShort } from '@/models/streetcode/streetcode-types.model';

// eslint-disable-next-line no-restricted-imports
import POPOVER_CONTENT from '../../JobsPage/JobsModal/constants/popoverContent';

const PartnerModal: React.FC< {
    partnerItem?: Partner;
    open: boolean;
    isStreetcodeVisible?: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    afterSubmit?: (partner: Partner) => void;
}> = observer(
    ({
        partnerItem,
        open,
        setIsModalOpen,
        isStreetcodeVisible = true,
        afterSubmit,
    }) => {
        // eslint-disable-next-line max-len,no-useless-escape
        const URL_REGEX_VALIDATION_PATTERN = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,256}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
        const LOGO_TYPES = Object.keys(LogoType).filter((key) => Number.isNaN(Number(key)));
        const [form] = Form.useForm();
        const [urlTitleEnabled, setUrlTitleEnabled] = useState<string>('');
        const [urlTitleValue, setUrlTitleValue] = useState<string>('');
        const [showSecondForm, setShowSecondForm] = useState(false);
        const [showSecondFormButton, setShowSecondFormButton] = useState(true);

        const { partnersStore, streetcodeShortStore } = useMobx();
        const [partnerLinksForm] = Form.useForm();
        const [previewOpen, setPreviewOpen] = useState(false);
        const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
        const selectedStreetcodes = useRef<StreetcodeShort[]>([]);
        const [fileList, setFileList] = useState<UploadFile[]>([]);
        const [partnerSourceLinks, setPartnersSourceLinks] = useState<PartnerSourceLinkCreateUpdate[]>([]);
        const imageId = useRef<number>(0);
        const [actionSuccess, setActionSuccess] = useState(false);
        const [waitingForApiResponse, setWaitingForApiResponse] = useState(false);
        const [isSaved, setIsSaved] = useState(true);

        message.config({
            top: 100,
            duration: 2,
            maxCount: 1,
        });

        useEffect(() => {
            setWaitingForApiResponse(false);
            if (actionSuccess) {
                message.success('Партнера успішно додано/оновлено!');
                setActionSuccess(false);
            }
        }, [actionSuccess]);

        useEffect(() => {
            const getImageAsFileInArray = (): UploadFile[] => (
                partnerItem
                    ? [
                        {
                            name: '',
                            thumbUrl: base64ToUrl(
                                partnerItem.logo?.base64,
                                partnerItem.logo?.mimeType,
                            ),
                            uid: partnerItem.logoId.toString(),
                            status: 'done',
                        },
                    ] : []);

            if (partnerItem && open) {
                imageId.current = partnerItem.logoId;
                setFileList(getImageAsFileInArray());

                form.setFieldsValue({
                    title: partnerItem.title,
                    isKeyPartner: partnerItem.isKeyPartner,
                    url: partnerItem.targetUrl?.href,
                    urlTitle: partnerItem.targetUrl?.title,
                    description: partnerItem.description,
                    partnersStreetcodes: partnerItem.streetcodes.map((s: { title: string; }) => s.title),
                    isVisibleEverywhere: partnerItem.isVisibleEverywhere,
                    logo: getImageAsFileInArray(),
                });
                setUrlTitleEnabled(form.getFieldValue('url'));
                setUrlTitleValue(form.getFieldValue('urlTitle'));

                selectedStreetcodes.current = partnerItem.streetcodes;
                setPartnersSourceLinks(
                    partnerItem.partnerSourceLinks.map((l: { id: any; logoType: any; targetUrl: { href: any; }; }) => ({
                        ...l,
                        targetUrl: l.targetUrl.href,
                    })),
                );
            } else {
                imageId.current = 0;
            }
        }, [partnerItem, open, form]);

        const handlePreview = (file: UploadFile) => {
            setFilePreview(file);
            setPreviewOpen(true);
        };

        const handleInputChange = () => setIsSaved(false);

        const onStreetcodeSelect = (value: string) => {
            streetcodeShortStore.StreetcodesShortMap.forEach((streetcodeShort) => {
                if (streetcodeShort.title === value) {
                    selectedStreetcodes.current.push(streetcodeShort);
                }
            });
        };

        const onStreetcodeDeselect = (value: string) => {
            selectedStreetcodes.current = selectedStreetcodes.current.filter(
                (c) => c.title !== value,
            );
        };

        const handleOk = async () => {
            try {
                setWaitingForApiResponse(true);
                await form.validateFields();
                form.submit();
                message.success('Партнера успішно додано!');
                setIsSaved(true);
            } catch (error) {
                setWaitingForApiResponse(false);
                message.error("Будь ласка, заповніть всі обов'язкові поля та перевірте валідність ваших даних");
            }
        };

        const closeAndCleanData = () => {
            if (!waitingForApiResponse) {
                form.resetFields();
                partnerLinksForm.resetFields();
                selectedStreetcodes.current = [];
                partnerSourceLinks.splice(0);
                setIsModalOpen(false);
                setShowSecondForm(false);
                setShowSecondFormButton(true);
                setUrlTitleEnabled('');
                setUrlTitleValue('');
                setFileList([]);
            }
        };

        const closeModal = () => {
            if (!waitingForApiResponse) {
                setIsModalOpen(false);
                setIsSaved(true);
            }
        };

        const onSuccesfulSubmitLinks = (formValues: any) => {
            const url = formValues.url as string;
            const logotype = partnerLinksForm.getFieldValue('logotype');

            let newId = Math.min(...partnerSourceLinks.map((item) => item.id));
            if (newId < 0) {
                newId -= 1;
            } else {
                newId = -1;
            }
            setPartnersSourceLinks([
                ...partnerSourceLinks,
                {
                    id: newId,
                    logoType: Number(LogoType[logotype]),
                    targetUrl: url,
                },
            ]);
            partnerLinksForm.resetFields();
            setShowSecondForm(false);
            setShowSecondFormButton(true);
            handleInputChange();
        };

        const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            try {
                await form.validateFields(['url']);
                setUrlTitleEnabled(value);
                handleInputChange();
            } catch (error) {
                setUrlTitleEnabled('');
            }
        };

        const handleUrlTitleChange = async (
            e: React.ChangeEvent<HTMLInputElement>,
        ) => {
            const { value } = e.target;
            setUrlTitleValue(value);
            handleInputChange();
        };

        const handleShowSecondForm = () => {
            setShowSecondForm(true);
            setShowSecondFormButton(false);
        };

        const handleHideSecondForm = () => {
            setShowSecondForm(false);
            setShowSecondFormButton(true);
        };

        const onSuccesfulSubmitPartner = async (formValues: any) => {
            message.loading('Зберігання...');

            partnerSourceLinks.forEach((el, index) => {
                if (el.id < 0) {
                    partnerSourceLinks[index].id = 0;
                }
            });

            if (!form.getFieldValue('url')) {
                formValues.urlTitle = null;
            }

            const partner: PartnerCreateUpdate = {
                id: 0,
                isKeyPartner: formValues.isKeyPartner ?? false,
                logoId: imageId.current,
                partnerSourceLinks,
                streetcodes: selectedStreetcodes.current,
                targetUrl: formValues.url?.trim() || null,
                title: formValues.title,
                description: formValues.description?.trim() || null,
                urlTitle: formValues.urlTitle?.trim() || null,
                isVisibleEverywhere: formValues.isVisibleEverywhere ?? false,
            };

            partnersStore.getPartnerArray.map((t) => t).forEach((t) => {
                if (formValues.title === t.title || imageId.current === t.logoId) {
                    partnerItem = t;
                }
            });

            try {
                if (!imageId.current) {
                    throw new Error("Image isn't uploaded yet");
                }

                if (partnerItem) {
                    partner.id = partnerItem.id;
                    await partnersStore.updatePartner(partner);
                } else {
                    partner.id = (await partnersStore.createPartner(partner)).id;
                }

                if (afterSubmit) {
                    const partnerWithLogo = partnersStore.PartnerMap.get(partner.id) as Partner;
                    afterSubmit(partnerWithLogo);
                }

                setActionSuccess(true);
            } catch (e: unknown) {
                message.error('Не вдалось оновити/створити партнера. Спробуйте ще раз.');
                setWaitingForApiResponse(false);
            }
        };

        const handleFileChange = async (param: UploadChangeParam<UploadFile<unknown>>) => {
            if (await checkFile(param.file)) {
                handleInputChange();
                setFileList(param.fileList);
            }
        };

        const handleRemove = () => {
            imageId.current = 0;
            setFileList([]);
        };

        const validateTitle = uniquenessValidator(
            () => (partnersStore.getPartnerArray.map((partner) => partner.title)),
            () => (partnerItem?.title),
            'Партнер з такою назвою вже існує',
        );

        return (
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
                        form={form}
                        layout="vertical"
                        onFinish={onSuccesfulSubmitPartner}
                    >
                        <div className="center">
                            <h2>
                                {partnerItem ? 'Редагувати' : 'Додати'}
                                {' '}
                                партнера
                            </h2>
                        </div>
                        <div className="checkbox-container">
                            <Form.Item
                                className="line-form-item"
                                name="isKeyPartner"
                                valuePropName="checked"
                                label="Ключовий партнер: "
                            >
                                <Checkbox onChange={handleInputChange} />
                            </Form.Item>

                            <Form.Item
                                className="line-form-item"
                                name="isVisibleEverywhere"
                                valuePropName="checked"
                                label="Видимий для всіх: "
                            >
                                <Checkbox onChange={handleInputChange} />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="title"
                            label="Назва: "
                            rules={[{ required: true, message: 'Введіть назву' }, { validator: validateTitle }]}
                        >
                            <Input maxLength={100} showCount onChange={handleInputChange} />
                        </Form.Item>

                        <Form.Item
                            name="url"
                            label="Посилання: "
                            rules={[
                                {
                                    pattern: URL_REGEX_VALIDATION_PATTERN,
                                    message: 'Введіть правильне посилання',
                                },
                            ]}
                        >
                            <Input maxLength={200} showCount onChange={handleUrlChange} />
                        </Form.Item>

                        <Form.Item name="urlTitle" label="Назва посилання:">
                            <Input
                                maxLength={100}
                                showCount
                                disabled={!urlTitleEnabled}
                                onChange={handleUrlTitleChange}
                            />
                        </Form.Item>
                        {urlTitleEnabled === '' && urlTitleValue && (
                            <p className="error-text">
                                Введіть правильне посилання для збереження назви посилання.
                            </p>
                        )}

                        <Form.Item name="description" label="Опис: ">
                            <TextArea showCount maxLength={450} onChange={handleInputChange} />
                        </Form.Item>

                        <Form.Item
                            name="logo"
                            label="Лого"
                            rules={[
                                {
                                    required: true,
                                    message: 'Завантажте лого',
                                },
                                { validator: combinedImageValidator(true) },
                            ]}
                        >
                            <FileUploader
                                fileList={fileList}
                                className="logo-uploader"
                                multiple={false}
                                accept=".jpeg,.png,.jpg,.webp"
                                listType="picture-card"
                                maxCount={1}
                                onPreview={handlePreview}
                                beforeUpload={checkFile}
                                onChange={handleFileChange}
                                onRemove={handleRemove}
                                uploadTo="image"
                                onSuccessUpload={(image: Image | Audio) => {
                                    imageId.current = image.id;
                                }}
                            >
                                <p>Виберіть чи перетягніть файл</p>
                            </FileUploader>
                        </Form.Item>
                        <PreviewFileModal
                            opened={previewOpen}
                            setOpened={setPreviewOpen}
                            file={filePreview}
                        />

                        {isStreetcodeVisible ? (
                            <Form.Item name="partnersStreetcodes" label="History-коди: ">
                                <Select
                                    mode="multiple"
                                    onChange={handleInputChange}
                                    onSelect={onStreetcodeSelect}
                                    onDeselect={onStreetcodeDeselect}
                                >
                                    {Array.from(
                                        streetcodeShortStore.StreetcodesShortMap.values(),
                                    ).map((streetcodeShort) => (
                                        <Select.Option key={`${streetcodeShort.id}`} value={streetcodeShort.title}>
                                            {streetcodeShort.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : (
                            ''
                        )}
                    </Form>
                </div>
                <div className="partner-source-list">
                    {partnerSourceLinks.map((link) => (
                        <div
                            key={`${link.id}${link.logoType}`}
                            className="partner-source-list-item"
                        >
                            <PartnerLink link={link} />
                            <p className="partner-source-text">{link.targetUrl}</p>
                            <DeleteOutlined
                                onClick={() => setPartnersSourceLinks(
                                    partnerSourceLinks.filter((l) => l.id !== link.id),
                                )}
                            />
                        </div>
                    ))}
                </div>
                {showSecondFormButton && (
                    <Button
                        onClick={handleShowSecondForm}
                        className="add-social-media-button"
                    >
                        {BUTTON_LABELS.ADD_SOCIAL_NETWORK}
                    </Button>
                )}
                <Form
                    layout="vertical"
                    form={partnerLinksForm}
                    onFinish={onSuccesfulSubmitLinks}
                >
                    {showSecondForm && (
                        <div>
                            <div className="button-container">
                                <Button onClick={handleHideSecondForm} className="close-button">
                                    {BUTTON_LABELS.CLOSE}
                                </Button>
                            </div>
                            <div className="link-container">
                                <FormItem
                                    name="logotype"
                                    label="Соціальна мережа"
                                    rules={[{ required: true, message: 'Виберіть соц. мережу' }]}
                                    className="social-media-form-item"
                                >
                                    <Select
                                        options={SOCIAL_OPTIONS}
                                        onChange={() => partnerLinksForm.validateFields(['url'])}
                                    />
                                </FormItem>
                                <Form.Item
                                    label="Посилання"
                                    name="url"
                                    rules={[
                                        { required: true, message: 'Введіть Посилання' },
                                        {
                                            pattern: URL_REGEX_VALIDATION_PATTERN,
                                            message: 'Введіть правильне посилання',
                                        },
                                        {
                                            validator: (_, value) => {
                                                const socialName = partnerLinksForm.getFieldValue('logotype');
                                                return validateSocialLink<LogoType>(
                                                    value,
                                                    SOCIAL_OPTIONS,
                                                    LOGO_TYPES,
                                                    partnerSourceLinks,
                                                    socialName,
                                                );
                                            },
                                        },
                                    ]}
                                >
                                    <Input min={1} maxLength={255} showCount />
                                </Form.Item>

                                <Form.Item label=" ">
                                    <Popover content="Додати" trigger="hover">
                                        <Button htmlType="submit" className="plus-button">
                                            <PlusOutlined />
                                        </Button>
                                    </Popover>
                                </Form.Item>
                            </div>
                        </div>
                    )}
                </Form>

                <div className="center">
                    {showSecondForm ? (
                        <Popover content="Завершіть додавання соціальної мережі" trigger="hover">
                            <span>
                                <Button disabled className="streetcode-custom-button save">
                                    {BUTTON_LABELS.SAVE}
                                </Button>
                            </span>
                        </Popover>
                    ) : (
                        <Button
                            disabled={showSecondForm || fileList.length === 0 || isSaved}
                            className="streetcode-custom-button save"
                            onClick={handleOk}
                        >
                            {BUTTON_LABELS.SAVE}
                        </Button>
                    )}
                </div>
            </Modal>
        );
    },
);

export default PartnerModal;
