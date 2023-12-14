import './TeamModal.styles.scss';
import '@features/AdminPage/AdminModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import TeamMember, {
    LogoType, Positions,
    TeamCreateUpdate, TeamMemberLinkCreateUpdate,
} from '@models/team/team.model';
import useMobx from '@stores/root-store';

import {
    Button,
    Checkbox,
    Form, Input, message, Modal, Popover, Select, UploadFile,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { Option } from 'antd/es/mentions';

import PositionsApi from '@/app/api/team/positions.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import TeamLink from '@/features/AdminPage/TeamPage/TeamLink.component';
import Image from '@/models/media/image.model';

const TeamModal: React.FC<{
    teamMember?: TeamMember, open: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, afterSubmit?: (team: TeamCreateUpdate) => void
}> = observer(({ teamMember, open, setIsModalOpen, afterSubmit }) => {
    const [form] = Form.useForm();
    const { teamStore } = useMobx();
    const [positions, setPositions] = useState<Positions[]>([]);
    const [teamLinksForm] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [customWarningVisible, setCustomWarningVisible] = useState<boolean>(false);
    const [teamSourceLinks, setTeamSourceLinks] = useState<TeamMemberLinkCreateUpdate[]>([]);
    const [selectedPositions, setSelectedPositions] = useState<Positions[]>([]);
    const [isMain, setIsMain] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const imageId = useRef<number>(0);
    useEffect(() => {
        if (open) {
            PositionsApi.getAll().then((pos) => setPositions(pos));
        }
    }, [open]);

    const onPositionSelect = (selectedValue: string) => {
        let selected;
        const selectedIndex = positions.findIndex((t) => t.position === selectedValue);
        if (selectedIndex < 0) {
            let minId = Math.min(...selectedPositions.map((t) => t.id));
            if (minId < 0) {
                minId -= 1;
            } else {
                minId = -1;
            }
            setSelectedPositions([...selectedPositions, { id: minId, position: selectedValue }]);
        } else {
            selected = positions[selectedIndex];

            setSelectedPositions([...selectedPositions, { ...selected, position: selectedValue }]);
        }
    };

    const onPositionDeselect = (deselectedValue: string) => {
        setSelectedPositions(selectedPositions.filter((t) => t.position !== deselectedValue));
    };

    useEffect(() => {
        if (teamMember && open) {
            imageId.current = teamMember.imageId;
            form.setFieldsValue({
                name: teamMember.name,
                isMain: teamMember.isMain,
                description: teamMember.description,
                positions: teamMember.positions.map((s) => s.position),
                image: [
                    {
                        name: '',
                        thumbUrl: base64ToUrl(teamMember.image?.base64, teamMember.image?.mimeType),
                        uid: teamMember.imageId.toString(),
                        status: 'done',
                    }],
            });
            setSelectedPositions(teamMember.positions);
            setTeamSourceLinks(teamMember.teamMemberLinks.map((l) => ({
                id: l.id,
                logoType: l.logoType,
                targetUrl: l.targetUrl,
            })));
        } else {
            imageId.current = 0;
        }
    }, [teamMember, open, form]);

    const closeAndCleanData = () => {
        form.resetFields();
        teamLinksForm.resetFields();
        setSelectedPositions([]);
        teamSourceLinks.splice(0);
        setIsModalOpen(false);
        setFileList([]);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const onSuccesfulSubmitLinks = (formValues: any) => {
        const url = formValues.url as string;
        const logotype = teamLinksForm.getFieldValue('logotype');
        if (!url.toLocaleLowerCase().includes(logotype)) {
            setCustomWarningVisible(true);
        } else {
            setCustomWarningVisible(false);
            let newId = Math.min(...teamSourceLinks.map((item) => item.id));
            if (newId < 0) {
                newId -= 1;
            } else {
                newId = -1;
            }
            setTeamSourceLinks([...teamSourceLinks, {
                id: newId,
                logoType: Number(LogoType[logotype]),
                targetUrl: url,
            }]);
        }
    };
    const handleOk = async () => {
        try {
            await form.validateFields();
            form.submit();
            message.success("Нового члена команди успішно додано!", 2)
        } catch (error) {
            message.config({
                top: 100,
                duration: 3,
                maxCount: 3,
                rtl: true,
                prefixCls: 'my-message',
            });
            message.error("Будь ласка, заповніть всі обов'язкові поля та перевірте валідність ваших даних");
        }
    };
    const onSuccesfulSubmitPosition = async (formValues: any) => {
        teamSourceLinks.forEach((el, index) => {
            if (el.id < 0) {
                teamSourceLinks[index].id = 0;
            }
        });

        const team: TeamCreateUpdate = {
            id: 0,
            isMain,
            imageId: imageId.current,
            teamMemberLinks: teamSourceLinks,
            name: formValues.name,
            positions: selectedPositions,
            description: formValues.description ?? '',
        };
        teamStore.getTeamArray.map((t) => t).forEach(t => {
        if (formValues.name == t.name  || imageId.current == t.imageId)
            teamMember = t;
        });
        if (teamMember) {
            team.id = teamMember.id;
            Promise.all([
                teamStore.updateTeam(team)
                    .then(() => {
                        if (afterSubmit) {
                            afterSubmit(team);
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    }),
            ]);
        } else {
            Promise.all([
                teamStore.createTeam(team)
                    .then(() => {
                        if (afterSubmit) {
                            afterSubmit(team);
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    }),
            ]);
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
    }, {
        value: 'linkedin',
        label: 'LinkedIn',
    }, {
        value: 'tiktok',
        label: 'TikTok',
    }, {
        value: 'behance',
        label: 'Behance',
    }, {
        value: 'https',
        label: 'Ваш сайт',
    }];

    useEffect(() => {
        setIsMain(teamMember ? teamMember.isMain : false);
    }, [teamMember]);

    const handleCheckboxChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setIsMain(e.target.checked);
    };
    return (
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
                    form={form}
                    layout="vertical"
                    onFinish={onSuccesfulSubmitPosition}
                >
                    <div className="center">
                        <h2>
                            {teamMember ? 'Редагувати' : 'Додати'}
                            {' '}
нового члена команди
                        </h2>
                    </div>
                    <div className="checkbox-container">
                        <Form.Item>
                            <Checkbox checked={isMain} onChange={handleCheckboxChange}>
                                Ключовий член команди
                            </Checkbox>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="name"
                        label="Прізвище та ім'я: "
                        rules={[{ required: true, message: "Введіть прізвище та ім'я" }]}
                    >
                        <Input maxLength={41} showCount />
                    </Form.Item>

                    <Form.Item label="Позиції">
                        <div className="tags-block-positionitems">

                            <Select
                                className="positions-select-input"
                                onSelect={onPositionSelect}
                                mode="tags"
                                onDeselect={onPositionDeselect}
                                value={selectedPositions.map((x) => x.position)}
                            >
                                {positions.map((t) => <Option key={`${t.id}`} value={t.position} />)}
                            </Select>
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Опис: "
                    >
                        <TextArea showCount maxLength={70} />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Фото"
                        valuePropName="fileList"
                        getValueFromEvent={(e: any) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e?.fileList;
                        }}
                        rules={[
                            {
                                required: true,
                                message: 'Будь ласка, завантажте фото',
                            },
                        ]}
                    >
                        <FileUploader
                            onChange={(param) => {
                                setFileList(param.fileList);
                            }}
                            fileList={fileList}
                            multiple={false}
                            accept=".jpeg,.png,.jpg,.webp"
                            listType="picture-card"
                            maxCount={1}
                            onPreview={(e) => {
                                setFilePreview(e); setPreviewOpen(true);
                            }}
                            uploadTo="image"
                            onSuccessUpload={(image: Image) => {
                                imageId.current = image.id;
                            }}
                            defaultFileList={(teamMember)
                                ? [{
                                    name: '',
                                    thumbUrl: base64ToUrl(teamMember.image?.base64, teamMember.image?.mimeType),
                                    uid: teamMember.imageId.toString(),
                                    status: 'done',
                                }]
                                : []}
                        >
                            <p>Виберіть чи перетягніть файл</p>
                        </FileUploader>
                    </Form.Item>
                    <PreviewFileModal opened={previewOpen} setOpened={setPreviewOpen} file={filePreview} />

                </Form>
            </div>

            <Form
                layout="vertical"
                form={teamLinksForm}
                onFinish={onSuccesfulSubmitLinks}
            >
                <div className="team-source-list">

                    {teamSourceLinks.map((link) => (
                        <div
                            className="link-container"
                            key={`${link.id}${link.logoType}`}
                        >
                            <TeamLink link={link} />
                            <p>{link.targetUrl}</p>
                            <DeleteOutlined
                                onClick={() => setTeamSourceLinks(teamSourceLinks
                                    .filter((l) => l.id !== link.id))}
                            />
                        </div>
                    ))}
                </div>
                <div className="link-container">
                    <FormItem
                        name="logotype"
                        label="Соціальна мережа"
                    >
                        <Select
                            options={selectSocialMediaOptions}
                        />
                    </FormItem>
                    <Form.Item
                        label=" "
                        className="url-input"
                        name="url"
                    >
                        <Input min={1} max={255} showCount />
                    </Form.Item>

                    <Form.Item
                        label=" "
                    >
                        <Button htmlType="submit">
                            <UserAddOutlined />
                        </Button>
                    </Form.Item>
                </div>
                {customWarningVisible ? <p className="red-text">Посилання не співпадає з вибраним текстом</p> : ''}

                <div className="center">
                    <Button disabled={fileList?.length === 0}  className="streetcode-custom-button" onClick={handleOk}>
                        Зберегти
                    </Button>
                </div>
            </Form>
        </Modal>
    );
});
export default TeamModal;
