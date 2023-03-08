import './StreetcodesTable.styles.scss';
import StreetcodesApi from "@/app/api/streetcode/streetcodes.api";
import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import Streetcode, { Status } from "@/models/streetcode/streetcode-types.model";
import Table from "antd/es/table/Table";
import { useEffect, useState } from "react";
import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import { Button, Input, Select, SelectProps } from 'antd';
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

    const options: SelectProps['options'] = [
        { value: 'published', label: 'опублікований' },
        { value: 'draft', label: 'чернетка' },
        { value : 'deleted', label: 'видалений' }
      ];

    const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    };

    return(
    <>
        <div className="StreetcodeTableWrapper">
            <div className='searchMenu'>
            <div className='searchMenuElement'>
                <Button className='Button'>Пошук стріткодів</Button>
            </div>
            <div className='searchMenuElement'>
                <Input
                    className='searchMenuElementInput'
                    prefix={<MagnifyingGlass />}
                    placeholder="Назва або індекс"
                />
            </div>
                <div className='searchMenuElement'>
                    <Select
                        mode="multiple"
                        allowClear
                        className='searchMenuStatusSelected'
                        placeholder="Статус стріткодів"
                        onChange={handleChange}
                        options={options}
                    />
                </div>
                <div className='searchMenuElement'>
                    <Button className='Button' onClick={() => window.open(`${FRONTEND_ROUTES.STREETCODE.BASE}/new-streetcode`,'_blank')}>Новий стріткод</Button>
                </div>
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