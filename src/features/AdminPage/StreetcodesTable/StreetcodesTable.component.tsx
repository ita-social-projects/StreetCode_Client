import './StreetcodesTable.styles.scss';
import StreetcodesApi from "@/app/api/streetcode/streetcodes.api";
import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import Streetcode, { Stage } from "@/models/streetcode/streetcode-types.model";
import Table from "antd/es/table/Table";
import { useEffect, useState } from "react";
import { Button } from 'antd';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import Modal from 'antd/es/modal/Modal';

const StreetcodesTable = () => {

    const { value } = useAsync(() => StreetcodesApi.getAll(), []);
    const streetcodes = value as Streetcode[];
    
    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedStreetCode[]>([]);

    const fullMonthNumericYearDateFmtr = new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const formatDate = (date?: Date): string => fullMonthNumericYearDateFmtr.format(date).replace('р.', 'року');

    // const [open, setOpen] = useState(false);
    // const [confirmLoading, setConfirmLoading] = useState(false);
    // const [modalText, setModalText] = useState('Content of the modal');

    // const showModal = () => {
    //     setOpen(true);
    // };

    // const handleOk = () => {
    //     setModalText('The modal will be closed after two seconds');
    //     setConfirmLoading(true);
    //     setTimeout(() => {
    //     setOpen(false);
    //     setConfirmLoading(false);
    //     }, 2000);
    // };

    // const handleCancel = () => {
    //     console.log('Clicked cancel button');
    //     setOpen(false);
    // };

    const DeleteAction = (record: MapedStreetCode) => {
        StreetcodesApi.delete(record.key)
                let updatedMapedStreetCodes = mapedStreetCodes.map((item) => {
                    if (item.index === record.index) {
                        return {
                            ...item,
                            stage: "Видалений"
                        };
                    }
                    return item;
                });
                
        setMapedStreetCodes(updatedMapedStreetCodes);
    }

    const columnsNames = [
        {
            title: 'Назва стріткоду',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Номер стріткоду',
            dataIndex: 'index',
            width: 150,
            key: 'index',
        },
        {
            title: 'Статус',
            dataIndex: 'stage',
            key: 'stage',
        },
        {
            title: 'Останні зміни',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            render: (value: any, record: MapedStreetCode, index: any) => 
            <>
                <FormOutlined className='actionButton' onClick={(event) => event.stopPropagation()}/>
                <DeleteOutlined className='actionButton' onClick={(event) => {
                event.stopPropagation()
                DeleteAction(record)
                }}/>
            </>
        }
    ]

    interface MapedStreetCode {
        key: number,
        index: number,
        stage: string,
        date: string,
        name: string
    }

    useEffect(() => {

        let mapedStreetCodes: MapedStreetCode[] = [];

        streetcodes?.map((streetcode) => {

            let currentStage: string = "";
            
            switch(streetcode.stage){
                case 0: {currentStage = "Чернетка"; break;}
                case 1: {currentStage = "Опублікований"; break;}
                case 2: {currentStage = "Видалений"; break;}
            }

            let mapedStreetCode = {
                key: streetcode.id,
                index: streetcode.index,
                stage: currentStage,
                date: formatDate(new Date(streetcode.updatedAt)),
                name: streetcode.type == 0 ? `${streetcode.title}` 
                : `${streetcode.firstName} ${streetcode.lastName}`
            }

            mapedStreetCodes.push(mapedStreetCode);
        });
        
        setMapedStreetCodes(mapedStreetCodes)
        
    }, [streetcodes]); 

    return(
    <>
        <div className="StreetcodeTableWrapper">
            {/* <Modal
            title="Delete streetcode"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
                Hello
            </Modal> */}
            <Button className='addButton' onClick={() => window.open(`${FRONTEND_ROUTES.STREETCODE.BASE}/new-streetcode`,'_blank')}>Новий стріткод</Button>
                <Table columns={columnsNames}
                dataSource={mapedStreetCodes}
                pagination={{className: "paginationButton", pageSize: 8}}
                onRow={(record: MapedStreetCode) => {
                    return {
                      onClick: () => window.open(`${FRONTEND_ROUTES.STREETCODE.BASE}/${record.index}`,'_blank')
                    }
                  }}
                />
        </div>
    </>);
}

export default StreetcodesTable;