import './SearchMenu.styles.scss';
import StreetcodesApi from "@/app/api/streetcode/streetcodes.api";
import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import Streetcode from "@/models/streetcode/streetcode-types.model";
import Table from "antd/es/table/Table";
import { useEffect, useState } from "react";
import GetAllStreetcodes from '@/models/streetcode/getAllStreetcodes.request';
import { DeleteOutlined, FormOutlined, RollbackOutlined } from '@ant-design/icons';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import useMobx from '@/app/stores/root-store';
import SearchMenu from './SearchMenu.component';
import { formatDate } from './FormatDateAlgorithm';

const StreetcodesTable = () => {

    const [titleRequest, setTitleRequest] = useState<string|null>(null);
    const [statusRequest, setStatusRequest] = useState<string|null>(null);

    const requestDefault: GetAllStreetcodes = {
        Page: 1,
        Amount: 10,
        Title: null,
        Sort: "Title",
        Filter: null
    }

    const [requestGetAll, setRequestGetAll] = useState<GetAllStreetcodes>(requestDefault);

    const setRequest = () => {
        setRequestGetAll({
            Page: 1,
            Amount: 10,
            Title: null,
            Sort: "UpdatedAt",
            Filter: `Status:${statusRequest}`
        })

        console.log(StreetcodesApi.getAll(requestGetAll))
    }

    const { modalStore: { setModal } } = useMobx(); 
    const { value } = useAsync(() => StreetcodesApi.getAll(requestGetAll), []);
    const streetcodes = value as Streetcode[];
    
    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedStreetCode[]>([]);

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
            <SearchMenu setStatus={setStatusRequest} setTitle={setTitleRequest} setRequest={setRequest}/> 
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