import './JobsTable.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';

import {
    Button, Dropdown, Empty, MenuProps, Pagination, Space, Table,
} from 'antd';

import JobApi from '@/app/api/job/Job.api';
import useMobx, { useModalContext } from '@/app/stores/root-store';

import JobsModalComponent from '../JobsModal/JobsModal.component';
import BUTTON_LABELS from "@constants/buttonLabels";

const JobsTable = observer(() => {
    const { jobsStore } = useMobx();

    const [currentId, setCurrentId] = useState<number>(0);
    const { modalStore } = useModalContext();
    const [open, setOpen] = useState(false);

    const { isLoading } = useQuery({
        queryKey: ['jobs', jobsStore.PaginationInfo.CurrentPage],
        queryFn: () => jobsStore.getAll(),
    });

    const DeleteJob = (id: number) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                JobApi.deleteJob(id)
                    .then(
                        () => {
                            jobsStore.JobsMap.delete(id);
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

                        jobsStore.setInternalMap(jobsStore.getJobsArray
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
                            {job.status === false ? 'Не активна' : 'Активна'}
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

    useEffect(() => {
        if (!open) {
            jobsStore.getAll();
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
                    {BUTTON_LABELS.ADD_VACANCY}
                </Button>
            </div>
            <JobsModalComponent
                currentId={currentId}
                open={open}
                setOpen={setOpen}
            />
            <Table
                pagination={false}
                columns={columnsNames}
                dataSource={jobsStore.getJobsArray || []}
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
            <div className="underTableZone">
                <br />
                <div className="underTableElement">
                    <Pagination
                        className="paginationElement"
                        showSizeChanger={false}
                        defaultCurrent={1}
                        current={jobsStore.PaginationInfo.CurrentPage}
                        total={jobsStore.PaginationInfo.TotalItems}
                        pageSize={jobsStore.PaginationInfo.PageSize}
                        onChange={(value: any) => {
                            jobsStore.setCurrentPage(value);
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default JobsTable;
