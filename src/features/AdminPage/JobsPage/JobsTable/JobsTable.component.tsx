import JobApi from '@/app/api/job/Job.api';
import { Button, Dropdown, MenuProps, Space, Table } from 'antd';
import { cloneElement, useEffect, useState } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { useModalContext } from '@/app/stores/root-store';
import { convertLegacyProps } from 'antd/es/button/button';

const JobsTable = () => {
    const [mappedJobsShort, setMappedJobsShort] = useState<JobShort[]>([]);
    const [curentId, setCurentId] = useState<number>(0);
    const { modalStore } = useModalContext();
   
    const DeleteJob = (id: number) => {
        modalStore.setConfirmationModal('confirmation', ()=>
        {
            JobApi.deleteJob(id)
                .then(
                    ()=>{
                        setMappedJobsShort(
                            mappedJobsShort.filter(
                                (j)=>(j.id!==id)
                            )
                        )
                    }
                )
                .catch(
                    (e) => {
                        console.log(e)
                    }
                );
                modalStore.setConfirmationModal('confirmation');
        },
        'Ви впевненні що хочете видалити вакансію?');
    }
    const items: MenuProps['items'] = [
        {
            label: 'Активна',
            key: '0'
        },
        {
            label: 'Не активна',
            key: '1'
        }
    ] 
    
    const handleMenuClick: MenuProps['onClick'] = async (opt) => {
        try {
            const selectedKey = +opt.key;
            let currentStatus:boolean = opt.key == '0' ? true : false;

            modalStore.setConfirmationModal(
                'confirmation',
                () => {
                    JobApi.changeStatus(curentId, currentStatus)
                        .then(
                            ()=>{
                                mappedJobsShort.map( job=> {
                                        if(job.id == curentId) {
                                            job.status = currentStatus;
                                        }
                                    }
                                )
                            }                            
                        )
                        .catch(
                            (e) => {
                                console.log(e)
                            }
                        );
                    modalStore.setConfirmationModal('confirmation');
                },
                'Ви впевнені, що хочете змінити статус вакансії?'
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
            key: 'title'
        },
        {
            title: 'Заробітня плата',
            dataIndex: 'salary',
            key: 'salary'
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',

            render: (status: boolean, job: JobShort) => (
                <Dropdown menu={menuProps} trigger={['click']}>
                    <Button onClick={()=>setCurentId(job.id)}>
                        <Space>
                            { job.status == false ? `Не активна`: 'Активна' }
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
            render: (id: number)=> (
                <div className='partner-page-actions'>
                    <DeleteOutlined onClick = {() => DeleteJob(id)}/>
                    <EditOutlined />
                </div>
            )
        }
    ]
   
    useEffect(
        ()=>{
            JobApi.getAllShort()
                .then(
                    response => {
                        // спрацьовує 2 раза, чому?
                        console.log(response);
                        setMappedJobsShort(response);
                    })
                .catch(
                    error => 
                    {
                        console.log(error);
                    });
         }
    ,[]);

    return(
        <div className="partners-page-container">
            <div className="container-justify-end">
                <Button className='streetcode-custom-button partners-page-add-button'>
                    Додати нову вакансію
                </Button>
            </div>
            <Table 
                columns={columnsNames}
                dataSource={mappedJobsShort}
                rowKey="id"
                >

            </Table>
        </div>
    )
}

export default JobsTable;