import './EditUserProfileModal.styles.scss';

import React, { ChangeEvent, useEffect, useState } from 'react';
import expertisesApi from '@api/expertises/expertises.api';
import usersApi from '@api/users/users.api';
import FileUploader from '@components/FileUploader/FileUploader.component';
import combinedImageValidator from '@components/modals/validators/combinedImageValidator';
import { checkImageFileType } from '@components/modals/validators/imageExtensionValidator';
import phoneNumberValidator from '@components/modals/validators/phoneNumberValidator';
import SelectWithCustomSuffix from '@components/SelectWithCustomSuffix';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import DeleteModal from '@features/UserProfile/DeleteModal/DeleteModal.component';
import DeleteModalConfirm from '@features/UserProfile/DeleteModalConfirm/DeleteModalConfirm.component';
import DiscardChangesModal from '@features/UserProfile/DiscardChangesModal/DiscardChangesModal.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Audio from '@models/media/audio.model';
import Image from '@models/media/image.model';
import Expertise from '@models/user/expertises/expertise.model';
import { UpdateUser } from '@models/user/user.model';
import useMobx from '@stores/root-store';
import base64ToUrl from '@utils/base64ToUrl.utility';
import parsePhoneNumber from '@utils/parsePhoneNumber';
import removeSpacesFromField from '@utils/removeSpacesFromField';
import validateLength from '@utils/userValidators/validateLength';
import validatePatternNameSurname from '@utils/userValidators/validatePatternNameSurname';
import validatePatternUserName from '@utils/userValidators/validatePatternUserName';
import validateRequired from '@utils/userValidators/validateRequired';

import {
    Button, ConfigProvider, Form, Input, message, Modal, Select,
} from 'antd';
import { UploadFile } from 'antd/es/upload';
import { UploadChangeParam } from 'antd/es/upload/interface';
import PhoneInput, { locale } from 'antd-phone-input';

interface Props {
    isOpen: boolean
    onClose: () => void
    onCloseWithoutChanges: () => void
    image: Image | undefined
    onChange: () => Promise<void>
    onDiscard: (confirm: boolean) => void
    openDiscardModal: boolean
    setOpenDiscardModal: (open: boolean) => void
}
const EditUserModal = ({
    isOpen, onClose, onCloseWithoutChanges, image, onChange, onDiscard, openDiscardModal, setOpenDiscardModal,
} : Props) => {
    const { userStore, imagesStore } = useMobx();

    const [form] = Form.useForm();
    const [emailForDeletion, setEmailForDeletion] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteConfirmedModal, setShowDeleteConfirmedModal] = useState(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [avatarId, setAvatarId] = useState<number | null>(image ? image.id : null);
    const [expertises, setExpertises] = useState<Expertise[]>([]);
    const [selectedExpertises, setSelectedExpertises] = useState(userStore.user?.expertises || []);
    const [fileList, setFileList] = useState<UploadFile[]>(image ? [{
        name: '',
        thumbUrl: base64ToUrl(image.base64, image.mimeType),
        uid: image.id ? image.id.toString() : '-1',
        status: 'done',
    }] : []);

    useAsync(async () => {
        const fetchExpertises = async () => {
            const data = await expertisesApi.getAll();
            setExpertises(data);
        };

        await fetchExpertises();
    }, []);

    useEffect(() => {
        if (userStore.user) {
            const updatedExpertises = userStore.user.expertises.map(
                (userExp) => expertises.find((exp) => exp.id === userExp.id) || userExp,
            );
            setSelectedExpertises(updatedExpertises);
        }
    }, [userStore.user, expertises]);

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const checkUniqueUserName = async (userName: string): Promise<boolean> => {
        try {
            const exists = await usersApi.existWithUserName(userName);
            return !exists;
        } catch (error) {
            console.error('Error while checking Index uniqueness:', error);
            return true;
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const phoneNumber = parsePhoneNumber(values.phoneNumber);

            const updatedData: UpdateUser = {
                ...userStore.user,
                ...values,
                phoneNumber,
                avatarId,
                expertises: selectedExpertises,
            };
            await userStore.updateUser(updatedData);
            message.success('Профіль успішно оновлено');
            onCloseWithoutChanges();
        } catch (info) {
            console.error('Validation Failed:', info);
        }
    };

    const handleDeleteAccount = () => {
        if (emailForDeletion !== userStore.user?.email) {
            message.error('Адресу було введено неправильно');
            return;
        }
        setShowDeleteModal(false);
        setShowDeleteConfirmedModal(true);
    };
    const checkFile = (file: UploadFile) => checkImageFileType(file.type);

    const handleFileChange = (param: UploadChangeParam<UploadFile<unknown>>) => {
        const newFileList = param.fileList;
        setFileList(newFileList);
        if (param.file) {
            form.setFieldsValue({ image: param.file });
            form.validateFields();
        } else {
            form.setFieldsValue({ image: null });
        }
    };

    const handleSelectExpertise = (selectedValue : string) => {
        const expertise = expertises.find((exp) => exp.title === selectedValue);
        if (expertise && !selectedExpertises.some((e) => e.id === expertise.id)) {
            setSelectedExpertises((prev) => [...prev, expertise]);
        }
    };

    const handleDeselectExpertise = (deselectedValue : string) => {
        setSelectedExpertises((prev) => prev.filter((expertise) => expertise.title !== deselectedValue));
    };

    const handleUpload = (file: Image | Audio) => {
        imagesStore.addImage(file as Image);
        setAvatarId(file.id);
        message.success('Фотографію збережено успішно.');
    };

    const handleRemove = () => {
        setFileList([]);
        form.resetFields(['image']);
        setAvatarId(null);
        message.success('Фотографію видалено успішно');
    };

    const handleOnChangeDelete = (e: ChangeEvent<HTMLInputElement>) => {
        setEmailForDeletion(e.target.value);
    };

    return (
        <>
            <Modal
                title="Редагування профілю"
                open={isOpen}
                onCancel={onClose}
                footer={null}
                className="modalEditContainer"
            >
                <Form
                    className="editFormWrapper"
                    form={form}
                    layout="vertical"
                    initialValues={{
                        ...userStore.user,
                        expertises: userStore.user?.expertises.map((x) => x.title),
                    }}
                    onChange={onChange}
                >
                    <div className="editFormImageWrapper">
                        <Form.Item
                            name="image"
                            initialValue={
                                image
                                    ? [{
                                        name: '',
                                        thumbUrl: base64ToUrl(image.base64, image.mimeType),
                                        uid: image.id ? image.id.toString() : '-1',
                                        status: 'done',
                                    }] : []
                            }
                            style={{ textAlign: 'center', fontWeight: 700 }}
                            rules={[
                                { validator: combinedImageValidator(false) },
                            ]}
                        >
                            <div>

                                <FileUploader
                                    id="imageUpload"
                                    className="editAvatar"
                                    enableCrop
                                    multiple={false}
                                    accept=".jpeg,.png,.jpg,.webp"
                                    uploadTo="image"
                                    listType="picture-card"
                                    maxCount={1}
                                    beforeUpload={checkFile}
                                    cropAspect={3 / 4}
                                    onChange={handleFileChange}
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onSuccessUpload={handleUpload}
                                    onRemove={handleRemove}
                                    defaultFileList={image
                                        ? [{
                                            name: '',
                                            thumbUrl: base64ToUrl(image.base64, image.mimeType),
                                            uid: image.id ? image.id.toString() : '-1',
                                            status: 'done',
                                        }] : []}
                                >
                                    <button type="button">Завантажити фото</button>
                                </FileUploader>
                            </div>
                        </Form.Item>
                        <div className="imageButtonWrapper">
                            <Button
                                className="editImageButton"
                                onClick={() => document.getElementById('imageUpload')?.click()}
                            >
                                Змінити фото
                            </Button>
                            <Button
                                className="removeImageButton"
                                disabled={fileList.length === 0}
                                onClick={handleRemove}
                            >
                                Видалити фото
                            </Button>
                        </div>
                        <p className="formatText">Допустимий формат JPG, JPEG, PNG, WEBP, з розміром до 3 МБ.</p>
                    </div>
                    <div className="editFormUserInfoWrapper">
                        <div className="formItemFirst">
                            <Form.Item
                                normalize={removeSpacesFromField}
                                className="formItem"
                                label="Нікнейм"
                                name="userName"
                                rules={[{
                                    validator: async (_, value) => {
                                        if (!value) {
                                            return;
                                        }
                                        if (userStore.user?.userName === value) {
                                            return Promise.resolve();
                                        }
                                        const isUnique = checkUniqueUserName(value);

                                        if (await isUnique) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Це ім'я користувача вже існує"));
                                    },
                                },
                                {
                                    validator: validateRequired('Нікнейм'),
                                },
                                {
                                    validator: validateLength('Нікнейм', 2, 128),
                                },
                                {
                                    validator: validatePatternUserName('Нікнейм'),
                                }]}
                            >
                                <Input minLength={2} maxLength={128} showCount placeholder="Нікнейм" />
                            </Form.Item>
                        </div>
                        <Form.Item
                            normalize={removeSpacesFromField}
                            className="formItem"
                            label="Ім'я"
                            name="name"
                            rules={[{
                                validator: validateRequired("Ім'я"),
                            },
                            {
                                validator: validateLength("Ім'я", 2, 128),
                            },
                            {
                                validator: validatePatternNameSurname("Ім'я"),
                            }]}
                        >
                            <Input minLength={2} maxLength={128} showCount />
                        </Form.Item>
                        <Form.Item
                            normalize={removeSpacesFromField}
                            className="formItem"
                            label="Прізвище"
                            name="surname"
                            rules={[{
                                validator: validateRequired('Прізвище'),
                            },
                            {
                                validator: validateLength('Прізвище', 2, 128),
                            },
                            {
                                validator: validatePatternNameSurname('Прізвище'),
                            }]}
                        >
                            <Input minLength={2} maxLength={128} showCount />
                        </Form.Item>
                        <Form.Item className="formItem" label="Електронна адреса" name="email">
                            <Input disabled type="email" />
                        </Form.Item>
                        {/* ignore */}
                        <ConfigProvider locale={locale('ukUA')}>
                            <Form.Item
                                className="formItem"
                                label="Телефонний номер"
                                name="phoneNumber"
                                rules={[
                                    {
                                        validator: phoneNumberValidator,
                                    },
                                ]}
                            >
                                <PhoneInput
                                    value=""
                                    disableParentheses
                                    placeholder="+XXX XX XXX XXXX"
                                    enableSearch
                                    country="380"
                                    excludeCountries={['ru']}
                                    preferredCountries={['ua']}
                                />
                            </Form.Item>
                            <p className="phoneExample">Приклад: +380 50 567 45 45</p>
                        </ConfigProvider>
                        <Form.Item
                            className="formItem"
                            label="Експертиза"
                            name="expertises"
                            style={{ textAlign: 'start' }}
                            rules={[{
                                validator: (_, value) => {
                                    if (value?.length > 3) {
                                        return Promise.reject(
                                            new Error('Ви можете вибрати не більше трьох експертиз.'),
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            }]}
                        >
                            <SelectWithCustomSuffix
                                className="expertises-select-input"
                                mode="tags"
                                placeholder="Оберіть експертизу"
                                onSelect={handleSelectExpertise}
                                onDeselect={handleDeselectExpertise}
                            >
                                {expertises.map((expertise) => (
                                    <Select.Option key={expertise.id.toString()} value={expertise.title}>
                                        {expertise.title}
                                    </Select.Option>
                                ))}
                            </SelectWithCustomSuffix>
                        </Form.Item>
                        <Form.Item className="areaTextInput" label="Про себе" name="aboutYourself">
                            <Input.TextArea rows={10} showCount maxLength={500} />
                        </Form.Item>
                    </div>
                </Form>
                <div className="saveButton">
                    <Button onClick={handleSubmit}>
                    Зберегти зміни профілю
                    </Button>
                </div>
                <div className="lineSeparator" />
                <div className="deleteUserText">
                    <p className="boldText">Видалити профіль</p>
                    <div className="mainText">
                        <p>Видалення акаунта є незворотним.</p>
                        <p>
                            Після цього:
                        </p>
                        <ul>
                            <li>
                                Усі ваші персональні дані, включаючи інформацію профілю,
                                збережений прогрес та улюблений контент, буде безповоротно видалено.
                            </li>
                            <li>Ви втратите доступ до акаунта та всіх пов’язаних з ним даних.</li>
                            <li>Цю дію неможливо скасувати.</li>
                        </ul>
                        <p className="boldText">
                            Будь ласка, переконайтеся, що ви готові до цього, перш ніж продовжити.
                        </p>
                    </div>
                </div>

                <div className="deleteUser" style={{ marginTop: 32 }}>
                    <Button
                        type="primary"
                        danger
                        onClick={() => setShowDeleteModal(true)}
                        className="deleteButton"
                    >
                    Видалити профіль
                    </Button>

                </div>
            </Modal>
            <DeleteModal
                handleOnChange={handleOnChangeDelete}
                emailForDeletion={emailForDeletion}
                handleOnFinish={handleDeleteAccount}
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            />
            <DeleteModalConfirm
                emailForDeletion={emailForDeletion}
                showDeleteConfirmedModal={showDeleteConfirmedModal}
            />
            <DiscardChangesModal
                onDiscardConfirm={onDiscard}
                isOpen={openDiscardModal}
                setIsOpen={setOpenDiscardModal}
            />
            <PreviewFileModal file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
        </>
    );
};

export default EditUserModal;
