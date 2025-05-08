import './JobsModal.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import SubmitButton from '@components/SubmitButton.component';
import BUTTON_LABELS from '@constants/buttonLabels';
import { JOB_SALARY } from '@constants/regex.constants';

import {
    Form, Input, message, Modal, Popover, Select,
} from 'antd';

import JobApi from '@/app/api/job/Job.api';
import {
    checkQuillEditorTextLength,
    setQuillEditorContent,
} from '@/app/common/components/Editor/EditorUtilities/quillUtils.utility';
import Editor from '@/app/common/components/Editor/QEditor.component';

import POPOVER_CONTENT from './constants/popoverContent';

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

            message.success(POPOVER_CONTENT.SUCCESS, 2);
        } catch {
            message.error(POPOVER_CONTENT.FAIL, 2);
        }
    };

    const handleFail = async () => {
        message.error(POPOVER_CONTENT.FAIL, 2);
    };

    const clearModal = () => {
        form.resetFields();
        setOpen(false);
    };

    const handleEditorChange = (content: string) => {
        setCurrent({
            ...current,
            description: content,
        });
    };

    return (
        <Modal
            className="modalContainer"
            open={open}
            onCancel={() => {
                setOpen(false);
            }}
            footer={null}
            maskClosable
            centered
            closeIcon={(
                <Popover content={POPOVER_CONTENT.CANCEL} trigger="hover">
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
                    rules={[{ required: true, message: 'Введіть назву вакансії' }]}
                >
                    <Input showCount maxLength={maxLengths.maxLengthVacancyName} />
                </Form.Item>
                <Form.Item label="Статус вакансії" name="status">
                    <Select
                        key="statusSelectInput"
                        className="status-select-input"
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
                    rules={[
                        { required: true, message: 'Введіть заробітню плату' },
                        {
                            pattern: JOB_SALARY,
                            message: 'Заробітня плата повинна бути числом',
                        },
                    ]}
                >
                    <Input showCount maxLength={maxLengths.maxLengthVacancySalary} />
                </Form.Item>
                <div className="center">
                    <SubmitButton
                        form={form}
                        initialData={current}
                        className="streetcode-custom-button"
                        onClick={() => form.submit()}
                    >
                        {BUTTON_LABELS.SAVE}
                    </SubmitButton>
                </div>
            </Form>
        </Modal>
    );
};

export default observer(JobsModal);
