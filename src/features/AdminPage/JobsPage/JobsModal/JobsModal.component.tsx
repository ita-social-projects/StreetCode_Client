import './JobsModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';

import {
    Button, Form, Input, Modal, Popover,
    Select,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';

import JobApi from '@/app/api/job/Job.api';

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    currentId: number,
}

const JobsModal = ({ open, setOpen, currentId } : Props) => {
    const maxLengths = {
        maxLenghtVacancyName: 50,
        maxLenghtVacancyDesc: 2000,
        maxLenghtVacancySalary: 15,
    };
    const textEditor = useRef<TinyMCEEditor>();
    const [current, setCurrent] = useState<Job>();
    const [form] = Form.useForm();
    const setOfKeys = new Set(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'End', 'Home']);
    const [storedJob, setStoredJob] = useState<Job>();
    const [validateDescription, setValidateDescription] = useState<boolean>(true);
    const emptyJob : Job = {
        title: form.getFieldValue('title'),
        description: form.getFieldValue('description'),
        status: form.getFieldValue('status'),
        id: 0,
        salary: form.getFieldValue('salary'),
    };

    useEffect(() => {
        const fetchJobData = async () => {
            if (open && currentId !== 0) {
                try {
                    const currentJob = await JobApi.getById(currentId);
                    setCurrent(currentJob);
                    textEditor.current?.editor?.setContent(currentJob?.description);
                    form.setFieldsValue({
                        title: currentJob?.title,
                        status: currentJob?.status ? 'setActive' : 'setInactive',
                        description: currentJob?.description,
                        salary: currentJob?.salary,
                    });
                } catch (error) {
                    console.log(error);
                }
            } else if (currentId === 0) {
                setStoredJob(emptyJob);
                form.setFieldsValue({
                    title: storedJob?.title,
                    status: storedJob?.status ? 'setActive' : 'setInactive',
                    description: storedJob?.description,
                    salary: storedJob?.salary,
                });
            }
        };

        textEditor.current?.editor?.setContent('');
        fetchJobData();
    }, [open, currentId, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            const { title, status, description, salary } = values;
            const isActive = status === 'setActive';

            const newJob: Job = {
                id: currentId,
                title,
                status: isActive,
                description: current.description,
                salary,
            };

            if (currentId === 0) {
                await JobApi.create(newJob);
            } else {
                await JobApi.update(newJob);
            }
            clearModal();
        } catch (error) {
            console.log(error);
        }
    };

    const clearModal = () => {
        form.resetFields();
        setValidateDescription(true);
        setOpen(false);
    };

    const handleEditorChange = (content: string, editor: any) => {
        setCurrent({ ...current, description: content });
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
                <Popover content="Внесені зміни не будуть збережені!" trigger="hover">
                    <CancelBtn className="iconSize" onClick={clearModal} />
                </Popover>
            )}
        >
            <div className="center">
                <h2>Вакансії</h2>
            </div>
            <Form
                layout="vertical"
                form={form}
            >
                <FormItem
                    label="Назва вакансії"
                    name="title"
                    rules={[{ required: true, message: 'Введіть назву вакансії' }]}
                >
                    <Input
                        showCount
                        maxLength={maxLengths.maxLenghtVacancyName}
                    />
                </FormItem>
                <FormItem
                    label="Статус вакансії"
                    name="status"
                >
                    <Select
                        key="statusSelectInput"
                        className="status-select-input"
                        defaultValue="setActive"
                    >
                        <Select.Option key="active" value="setActive">
                            Активна
                        </Select.Option>
                        <Select.Option key="inactive" value="setInactive">
                            Не активна
                        </Select.Option>
                    </Select>
                </FormItem>

                <label>Опис вакансії</label>
                <TinyMCEEditor
                    className="textWrapper"
                    ref={textEditor}
                    onEditorChange={(event, editor) => {
                        handleEditorChange(event, editor);
                    }}
                    init={{
                        max_chars: maxLengths.maxLenghtVacancyDesc,
                        language: 'uk',
                        height: 300,
                        menubar: false,
                        init_instance_callback(editor) {
                            editor.setContent(current?.description ?? '');
                        },
                        plugins: [
                            'autolink',
                            'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                            'insertdatetime', 'wordcount', 'link', 'lists',
                        ],
                        toolbar: 'undo redo blocks bold italic link align | underline superscript subscript '
                            + 'formats blockformats align | removeformat strikethrough ',
                        content_style: 'body {font - family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                        link_title: false,
                        link_target_list: false,
                    }}
                    onPaste={(e, editor) => {
                        const previousContent = editor.getContent({ format: 'text' });
                        const clipboardContent = e.clipboardData?.getData('text') || '';
                        const resultContent = previousContent + clipboardContent;
                        const isSelectionEnd = editor.selection.getSel()?.anchorOffset == previousContent.length;

                        if (resultContent.length >= maxLengths.maxLenghtVacancyDesc && isSelectionEnd) {
                            editor.setContent(previousContent + clipboardContent.substring(0, maxLengths.maxLenghtVacancyDesc - previousContent.length));
                            e.preventDefault();
                        }
                        if (resultContent.length <= maxLengths.maxLenghtVacancyDesc && !isSelectionEnd) {
                            return;
                        }
                        if (resultContent.length >= maxLengths.maxLenghtVacancyDesc && !isSelectionEnd) {
                            e.preventDefault();
                        }
                    }}
                    onKeyDown={(e, editor) => {
                        if (editor.getContent({ format: 'text' }).length >= maxLengths.maxLenghtVacancyDesc
                            && !setOfKeys.has(e.key)
                            && editor.selection.getContent({ format: 'text' }).length === 0) {
                            e.preventDefault();
                            setValidateDescription(false);
                        } else {
                            setValidateDescription(true);
                        }
                    }}
                    onChange={(e, editor) => {
                        setCurrent({ ...current, description: editor.getContent() });
                    }}
                />
                {!validateDescription ? <label className="validateLabelDescription">Занадто довгий опис</label> : <></>}
                <FormItem
                    label="Заробітня плата"
                    name="salary"
                    rules={[{ required: true, message: 'Введіть заробітню плату' }]}
                >
                    <Input
                        showCount
                        maxLength={maxLengths.maxLenghtVacancySalary}
                    />
                </FormItem>
                <div className="center">
                    <Button className="streetcode-custom-button" htmlType="submit" onClick={handleSave}>
                        Зберегти
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default observer(JobsModal);
