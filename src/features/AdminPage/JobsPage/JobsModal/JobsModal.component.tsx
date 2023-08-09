import './JobsModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';

import {
    Button, Form, Input, Modal, Select,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

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

    const [current, setCurrent] = useState<Job>();
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchJobData = async () => {
            if (open && currentId !== 0) {
                try {
                    const currentJob = await JobApi.getById(currentId);
                    setCurrent(currentJob);
                    form.setFieldsValue({
                        title: currentJob?.title,
                        status: currentJob?.status ? 'setActive' : 'setInactive',
                        description: currentJob?.description,
                        salary: currentJob?.salary,
                    });
                } catch (error) {
                    console.log(error);
                }
            } else {
                form.setFieldsValue({
                    title: '',
                    status: '',
                    description: '',
                    salary: '',
                });
            }
        };
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
                description,
                salary,
            };

            if (currentId === 0) {
                await JobApi.create(newJob);
            } else {
                await JobApi.update(newJob);
            }
            setOpen(false);
        } catch (error) {
            console.log(error);
        }
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
            closeIcon={<CancelBtn />}
        >
            <div className="center">
                <h2>Вакакансії</h2>
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
                <FormItem
                    label="Опис вакансії"
                    name="description"
                    rules={[{ required: true, message: 'Введіть опис вакансії' }]}
                >
                    <TextArea
                        className="textWrapper"
                        showCount
                        maxLength={maxLengths.maxLenghtVacancyDesc}
                    />
                </FormItem>
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
