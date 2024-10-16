import { useEffect, useState } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';

import {
    Button, Dropdown, Empty, MenuProps, Space, Table,
} from 'antd';

import JobApi from '@/app/api/job/Job.api';
import { useModalContext } from '@/app/stores/root-store';

import JobsModalComponent from '../JobsModal/JobsModal.component';
import './JobsTable.styles.scss'

const JobsTable = () => {
    const [mappedJobsShort, setMappedJobsShort] = useState<JobShort[]>([]);
    const [currentId, setCurrentId] = useState<number>(0);
    const { modalStore } = useModalContext();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
                            console.error(e);
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
                        console.error(e);
                    }
                },
                'Ви впевнені, що хочете змінити статус вакансії?',
            );
        } catch (error) {
            console.error(error);
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
                    <DeleteOutlined 
                        onClick={() => DeleteJob(id)} 
                        className="actionButton"
                    />
                    <EditOutlined 
                        onClick={() => {
                            setOpen(true);
                            setCurrentId(id);
                        }}
                        className="actionButton"
                    />
                </div>
            ),
        },
    ];

    const fetchJobsData = () => {
        setIsLoading(true);
        JobApi.getAllShort().then((response) => {
            setMappedJobsShort(response);
            setIsLoading(false);
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
                dataSource={isLoading ? [] : mappedJobsShort}
                className="job-table"
                rowKey="id"
                locale={{
                    emptyText: isLoading ? (
                        <div className="loadingWrapper">
                            <div id="loadingGif" />
                        </div>
                    ) : (
                        <Empty description="Дані відсутні" />
                    ),
                }}
            />
        </div>
    );
};

export default JobsTable;
