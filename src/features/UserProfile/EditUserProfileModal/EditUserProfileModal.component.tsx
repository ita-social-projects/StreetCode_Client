import './EditUserProfileModal.styles.scss';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import expertisesApi from '@api/expertises/expertises.api';
import FileUploader from '@components/FileUploader/FileUploader.component';
import imageValidator, { checkImageFileType } from '@components/modals/validators/imageValidator';
import phoneNumberValidator from '@components/modals/validators/phoneNumberValidator';
import SelectWithCustomSuffix from '@components/SelectWithCustomSuffix';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Audio from '@models/media/audio.model';
import Image from '@models/media/image.model';
import Expertise from '@models/user/expertises/expertise.model';
import { UpdateUser } from '@models/user/user.model';
import useMobx from '@stores/root-store';
import base64ToUrl from '@utils/base64ToUrl.utility';
import parsePhoneNumber from '@utils/parsePhoneNumber';

import {
    Button, ConfigProvider, Form, Input, message, Modal, Select,
} from 'antd';
import { UploadFile } from 'antd/es/upload';
import { UploadChangeParam } from 'antd/es/upload/interface';
import PhoneInput, { locale } from 'antd-phone-input';

interface Props {
    isOpen: boolean
    onClose: () => void
    image: Image | undefined
}
const EditUserModal = ({ isOpen, onClose, image } : Props) => {
    const { userStore, imagesStore } = useMobx();

    const [fileList, setFileList] = useState<UploadFile[]>(image ? [{
        name: '',
        thumbUrl: base64ToUrl(image.base64, image.mimeType),
        uid: image.id ? image.id.toString() : '-1',
        status: 'done',
    }] : []);
    const [form] = Form.useForm();
    const [emailForDeletion, setEmailForDeletion] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [avatarId, setAvatarId] = useState<number | null>(image ? image.id : null);
    const [expertises, setExpertises] = useState<Expertise[]>([]);
    const [selectedExpertises, setSelectedExpertises] = useState(userStore.user?.expertises || []);
    const navigate = useNavigate();

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
            onClose();
        } catch (info) {
            console.error('Validation Failed:', info);
        }
    };

    const handleDeleteAccount = () => {
        if (emailForDeletion !== userStore.user?.email) {
            message.error('Адресу було введено неправильно');
            return;
        }
        userStore.deleteUser(emailForDeletion);
        message.success('Профіль успішно видалено');
        navigate(FRONTEND_ROUTES.BASE);
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

    return (
        <>
            <Modal
                title="Редагування профілю"
                style={{ textAlign: 'center' }}
                open={isOpen}
                onCancel={onClose}
                footer={null}
                width={600}
                className="modalEditContainer"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        ...userStore.user,
                        expertises: userStore.user?.expertises.map((x) => x.title),
                    }}
                >
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
                        label="Фото профілю"
                        style={{ textAlign: 'center', fontWeight: 700 }}
                        rules={[
                            { validator: imageValidator },
                        ]}
                    >
                        <div>

                            <FileUploader
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
                                {/* ignore */}
                                {fileList.length === 0 ? <button type="button">Upload Image</button> : null}
                            </FileUploader>
                            <p>Допустимий формат JPG, JPEG, PNG, WEBP, з розміром до 3 МБ.</p>
                        </div>
                    </Form.Item>
                    <div className="lineSeparator" />
                    <Form.Item className="formItem" label="Нікнейм" name="userName">
                        <Input disabled placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        className="formItem"
                        label="Ім'я"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Введіть ім'я",
                            },
                            {
                                min: 2,
                                max: 128,
                                message: 'Повинно містити від 2 до 128 символів.',
                            },
                            {
                                pattern: /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ'-]+$/,
                                message: 'ім\'я може містити лише літери латиниці '
                                    + "або кирилиці (великі та малі), дефіс (-) і апостроф (').",
                            },
                        ]}
                    >
                        <Input minLength={2} maxLength={128} showCount />
                    </Form.Item>
                    <Form.Item
                        className="formItem"
                        label="Прізвище"
                        name="surname"
                        rules={[
                            {
                                required: true,
                                message: 'Введіть прізвище',
                            },
                            {
                                min: 2,
                                max: 128,
                                message: 'Повинно містити від 2 до 128 символів.',
                            },
                            {
                                pattern: /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ'-]+$/,
                                message: 'Прізвище може містити лише літери латиниці '
                                    + "або кирилиці (великі та малі), дефіс (-) і апостроф (').",
                            },
                        ]}
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
                    <Form.Item className="formItem" label="Про себе" name="aboutYourself">
                        <Input.TextArea rows={4} showCount maxLength={500} />
                    </Form.Item>
                    <Form.Item className="saveButton">
                        <Button onClick={handleSubmit}>
                            Зберегти зміни
                        </Button>
                    </Form.Item>
                </Form>
                <div className="lineSeparator" />
                <div className="deleteUserText">
                    <h3>Видалити обліковий запис</h3>
                    <div className="mainText">
                        <p>Шкода бачити, що ви йдете!</p>
                        <p>
                            Будь ласка, зверніть увагу: видалення вашого облікового запису та особистих даних є
                            безповоротним і не може бути скасовано.
                            HistoryCode не зможе відновити ваш обліковий запис або дані, що були видалені.
                        </p>
                        <p>
                            <span className="boldText">
                                Після видалення вашого облікового запису
                                ви не зможете використовувати його для проходження
                                курсів на HistoryCode.
                            </span>
                        </p>
                        <p>
                            Ви також можете втратити доступ до підтверджених сертифікатів
                            та інших програмних кваліфікацій.
                            Ви можете зробити копію цих документів для своїх записів перед тим, як продовжити видалення.
                        </p>
                        <p>
                            <span className="boldText">Попередження:</span>
                            видалення облікового запису є безповоротним.
                            Будь ласка, уважно прочитайте наведену інформацію перед тим, як продовжити.
                            Це незворотна дія!
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
                    Видалити обліковий запис
                    </Button>

                </div>
            </Modal>

            <Modal
                title="Підтвердження видалення облікового запису"
                open={showDeleteModal}
                onCancel={() => setShowDeleteModal(false)}
                footer={null}
                width={400}
                className="modalDeleteContainer"
            >
                <Form
                    layout="vertical"
                    onFinish={handleDeleteAccount}
                >
                    <Form.Item label="Підтвердіть вашу електронну адресу для видалення">
                        <Input
                            type="email"
                            value={emailForDeletion}
                            onChange={(e) => setEmailForDeletion(e.target.value)}
                            placeholder="Введіть вашу електронну адресу"
                        />
                    </Form.Item>
                    <Button
                        htmlType="submit"
                        className="confirmDeleteButton"
                    >
                        Підтвердити видалення
                    </Button>
                </Form>
            </Modal>
            <PreviewFileModal file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
        </>
    );
};

export default EditUserModal;
