import './StreetcodesTable.styles.scss';
import StreetcodesApi from "@/app/api/streetcode/streetcodes.api";
import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import Streetcode, { Status } from "@/models/streetcode/streetcode-types.model";
import Table from "antd/es/table/Table";
import { useEffect, useState } from "react";
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { DeleteOutlined, FormOutlined, RollbackOutlined } from '@ant-design/icons';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import useMobx from '@/app/stores/root-store';

const StreetcodesTable = () => {

    const { modalStore: { setModal } } = useMobx(); 
    const { value } = useAsync(() => StreetcodesApi.getAll(), []);
    const streetcodes = value as Streetcode[];
    
    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedStreetCode[]>([]);

    const formatDate = (date?: Date): string => {

        if(!date) {
            return "Could not to convert time!"
        }

        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let year = date.getFullYear().toString();
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    const DeleteAction = (record: MapedStreetCode) => {
        console.log("OK!")
        setModal('deleteStreetcode', record.key);
        StreetcodesApi.delete(record.key)
                let updatedMapedStreetCodes = mapedStreetCodes.map((item) => {
                    if (item.index === record.index) {
                        return {
                            ...item,
                            status: "Видалений",
                            date: formatDate(new Date())
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
            dataIndex: 'status',
            key: 'status',
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
                {record.status != "Видалений" ? 
                <>
                    <FormOutlined className='actionButton' onClick={(event) => event.stopPropagation()}/>
                    <DeleteOutlined className='actionButton' onClick={(event) => {
                    event.stopPropagation()
                    DeleteAction(record)
                }}/>
                </>
                : <RollbackOutlined className='actionButton'/>
                }
            </>
        }
    ]

    interface MapedStreetCode {
        key: number,
        index: number,
        status: string,
        date: string,
        name: string
    }

    useEffect(() => {

        let mapedStreetCodes: MapedStreetCode[] = [];

        streetcodes?.map((streetcode) => {

            console.log(streetcode)

            let currentStatus: string = "";
            
            switch(streetcode.status){
                case 0: {currentStatus = "Чернетка"; break;}
                case 1: {currentStatus = "Опублікований"; break;}
                case 2: {currentStatus = "Видалений"; break;}
            }

            let mapedStreetCode = {
                key: streetcode.id,
                index: streetcode.index,
                status: currentStatus,
                date: formatDate(new Date(streetcode.updatedAt)),
                name: streetcode.title,
            }

            mapedStreetCodes.push(mapedStreetCode);
        });
        
        setMapedStreetCodes(mapedStreetCodes)
        
    }, [streetcodes]); 

    return(
    <>
        <div className="StreetcodeTableWrapper">
            <div className='searchMenu'>
                <div className='searchMenuElement'><Button className='Button' onClick={() => window.open(`${FRONTEND_ROUTES.STREETCODE.BASE}/new-streetcode`,'_blank')}>Новий стріткод</Button></div>
                <div className='searchMenuElement'><Button className='Button' onClick={() => window.open(`${FRONTEND_ROUTES.STREETCODE.BASE}/new-streetcode`,'_blank')}>Новий стріткод</Button></div>
            </div> 
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