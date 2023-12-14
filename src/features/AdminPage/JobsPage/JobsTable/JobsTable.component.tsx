import { useEffect, useState } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';

import {
    Button, Dropdown, MenuProps, Space, Table,
} from 'antd';

import JobApi from '@/app/api/job/Job.api';
import { useModalContext } from '@/app/stores/root-store';

import JobsModalComponent from '../JobsModal/JobsModal.component';

const JobsTable = () => {
    const [mappedJobsShort, setMappedJobsShort] = useState<JobShort[]>([]);
    const [currentId, setCurrentId] = useState<number>(0);
    const { modalStore } = useModalContext();
    const [open, setOpen] = useState(false);

    const DeleteJob = (id: number) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                JobApi.deleteJob(id)
                    .then(
                        () => {
                            setMappedJobsShort(
                                mappedJobsShort.filter(
                                    (j) => (j.id !== id),
                                ),
                            );
                        },
                    )
                    .catch(
                        (e) => {
                            console.log(e);
                        },
                    );
                modalStore.setConfirmationModal('confirmation');
            },
            'Ви впевненні що хочете видалити вакансію?',
        );
    };
    const items: MenuProps['items'] = [
        {
            label: 'Активна',
            key: '0',
        },
        {
            label: 'Не активна',
            key: '1',
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = async (opt) => {
        try {
            const selectedKey = +opt.key;
            const currentStatus: boolean = opt.key === '0';
            modalStore.setConfirmationModal(
                'confirmation',
                async () => {
                    try {
                        await JobApi.changeStatus(currentId, currentStatus);

                        setMappedJobsShort((prevJobs) => prevJobs
                            .map((job) => (job.id === currentId ? { ...job, status: currentStatus } : job)));

                        modalStore.setConfirmationModal('confirmation');
                    } catch (e) {
                        console.log(e);
                    }
                },
                'Ви впевнені, що хочете змінити статус вакансії?',
            );
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const columnsNames = [
        {
            title: 'Назва вакансії',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Заробітня плата',
            dataIndex: 'salary',
            key: 'salary',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',

            render: (status: boolean, job: JobShort) => (
                <Dropdown menu={menuProps} trigger={['click']}>
                    <Button onClick={() => setCurrentId(job.id)}>
                        <Space>
                            { job.status === false ? 'Не активна' : 'Активна' }
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            ),
        },
        {
            title: 'Дії',
            dataIndex: 'id',
            key: 'actions',
            render: (id: number) => (
                <div className="partner-page-actions">
                    <DeleteOutlined onClick={() => DeleteJob(id)} />
                    <EditOutlined onClick={() => {
                        setOpen(true);
                        setCurrentId(id);
                    }}
                    />
                </div>
            ),
        },
    ];

    const fetchJobsData = () => {
        JobApi.getAllShort()
            .then((response) => {
                setMappedJobsShort(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (!open) {
            fetchJobsData();
        }
    }, [open]);

    const handleAddButtonClick = () => {
        setCurrentId(0);
        setOpen(true);
    };

    return (
        <div className="partners-page-container">
            <div className="container-justify-end">
                <Button
                    className="streetcode-custom-button partners-page-add-button"
                    onClick={handleAddButtonClick}
                >
                    Додати нову вакансію
                </Button>
            </div>
            <JobsModalComponent
                currentId={currentId}
                open={open}
                setOpen={setOpen}
            />
            <Table
                columns={columnsNames}
                dataSource={mappedJobsShort}
                rowKey="id"
            />
        </div>
    );
};

export default JobsTable;
