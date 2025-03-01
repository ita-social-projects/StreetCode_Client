import './JobsModal.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';

import {
    Button, Form, Input, message, Modal, Popover, Select,
} from 'antd';

import JobApi from '@/app/api/job/Job.api';
import {
    checkQuillEditorTextLength,
    setQuillEditorContent,
} from '@/app/common/components/Editor/EditorUtilities/quillUtils.utility';
import Editor from '@/app/common/components/Editor/QEditor.component';

import POPOVER_CONTENT from './constants/popoverContent';
import BUTTON_LABELS from '@constants/buttonLabels';

import SUCCESS_MESSAGES from "@/app/common/constants/success-messages.constants";
import REQUIRED_FIELD_MESSAGES from "@/app/common/constants/required_field_messages.constrants";
import VALIDATION_MESSAGES from "@/app/common/constants/validation-messages.constants";
import MODAL_MESSAGES from "@/app/common/constants/modal-messages.constants";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentId: number;
}

const JobsModal = ({ open, setOpen, currentId }: Props) => {
    const maxLengths = {
        maxLengthVacancyName: 50,
        maxLengthVacancyDesc: 2000,
        maxLengthVacancySalary: 15,
    };

    const [form] = Form.useForm();

    const emptyJob: Job = {
        title: form.getFieldValue('title'),
        description: '',
        status: form.getFieldValue('status') as string === 'setActive',
        id: 0,
        salary: form.getFieldValue('salary'),
    };

    const textEditor = useRef<ReactQuill | null>(null);
    const [current, setCurrent] = useState<Job>(emptyJob);
    const [editorCharacterCount, setEditorCharacterCount] = useState<number>(0);
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

    const fetchJobData = async () => {
        if (open && currentId !== 0) {
            try {
                const currentJob = await JobApi.getById(currentId);
                setQuillEditorContent(textEditor.current, currentJob?.description);
                setCurrent(currentJob);
                form.setFieldsValue({
                    title: currentJob.title,
                    status: currentJob.status ? 'setActive' : 'setInactive',
                    description: currentJob.description,
                    salary: currentJob.salary,
                });
            } catch (error) {
                console.error(error);
            }
        } else if (currentId === 0) {
            form.setFieldsValue({
                title: emptyJob.title,
                status: emptyJob.status ? 'setActive' : 'setInactive',
                description: emptyJob.description,
                salary: emptyJob.salary,
            });
        }
    };

    useEffect(() => {
        textEditor.current?.editor?.setText('');
        fetchJobData();
    }, [open, currentId]);

    const handleSave = async () => {
        try {
            const values = await form.getFieldsValue();
            checkQuillEditorTextLength(
                editorCharacterCount,
                maxLengths.maxLengthVacancyDesc,
            );
            const { title, status, salary } = values;
            const isActive = status === 'setActive';

            const newJob: Job = {
                id: currentId,
                title,
                status: isActive,
                description: current.description,
                salary,
            };

            const allJobs = await JobApi.getAllShort();
            allJobs
                ?.map((t) => t)
                .forEach((t) => {
                    if (values.title === t.title) {
                        newJob.id = t.id;
                    }
                });

            if (newJob.id === 0) {
                await JobApi.create(newJob);
            } else {
                await JobApi.update(newJob);
            }

            message.success(SUCCESS_MESSAGES.VACANCY_SAVED, 2);
            setIsSaveButtonDisabled(true);
        } catch {
            message.error(VALIDATION_MESSAGES.INVALID_VALIDATION, 2);
        }
    };

    const handleFail = async () => {
        message.error(VALIDATION_MESSAGES.INVALID_VALIDATION, 2);
    };

    const clearModal = () => {
        form.resetFields();
        setOpen(false);
    };

    const handleInputChange = () => {
        setIsSaveButtonDisabled(false);
    };

    const handleEditorChange = (content: string) => {
        setCurrent({
            ...current,
            description: content,
        });
        handleInputChange();
    };

    return (
        <Modal
            className="modalContainer"
            open={open}
            onCancel={() => {
                setOpen(false);
                setIsSaveButtonDisabled(true);
            }}
            footer={null}
            maskClosable
            centered
            closeIcon={(
                <Popover content={MODAL_MESSAGES.REMINDER_TO_SAVE} trigger="hover">
                    <CancelBtn className="iconSize" onClick={clearModal} />
                </Popover>
            )}
        >
            <div className="center">
                <h2>
                    {currentId === 0 ? 'Додати' : 'Редагувати'}
                    {' '}
                    вакансію
                </h2>
            </div>
            <Form
                layout="vertical"
                form={form}
                initialValues={{ status: 'setInactive' }}
                onFinish={handleSave}
                onFinishFailed={handleFail}
            >
                <Form.Item
                    label="Назва вакансії"
                    name="title"
                    rules={[{ required: true, message: REQUIRED_FIELD_MESSAGES.ENTER_VACANCY_TITLE }]}
                >
                    <Input showCount maxLength={maxLengths.maxLengthVacancyName} onChange={handleInputChange} />
                </Form.Item>
                <Form.Item label="Статус вакансії" name="status">
                    <Select
                        key="statusSelectInput"
                        className="status-select-input"
                        onChange={handleInputChange}
                    >
                        <Select.Option key="active" value="setActive">
                          Активна
                        </Select.Option>
                        <Select.Option key="inactive" value="setInactive">
                          Не активна
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Опис вакансії"
                    name="description"
                    data-testid="description"
                >
                    <Editor
                        qRef={textEditor}
                        value={current.description}
                        onChange={handleEditorChange}
                        maxChars={maxLengths.maxLengthVacancyDesc}
                        onCharacterCountChange={setEditorCharacterCount}
                    />
                </Form.Item>
                <Form.Item
                    label="Заробітня плата"
                    name="salary"
                    rules={[{ required: true, message: REQUIRED_FIELD_MESSAGES.ENTER_SALARY }]}
                >
                    <Input showCount maxLength={maxLengths.maxLengthVacancySalary} onChange={handleInputChange} />
                </Form.Item>
                <div className="center">
                    <Button
                        className="streetcode-custom-button"
                        onClick={() => {
                            form.submit();
                        }}
                        disabled={isSaveButtonDisabled}
                    >
                      {BUTTON_LABELS.SAVE}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default observer(JobsModal);
