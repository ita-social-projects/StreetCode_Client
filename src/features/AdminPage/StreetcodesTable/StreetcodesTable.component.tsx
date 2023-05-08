import './SearchMenu.styles.scss';
import StreetcodesApi from "@/app/api/streetcode/streetcodes.api";
import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import Streetcode from "@/models/streetcode/streetcode-types.model";
import Table from "antd/es/table/Table";
import { useEffect, useState } from "react";
import GetAllStreetcodesRequest from '@/models/streetcode/getAllStreetcodes.request';
import { DeleteOutlined, FormOutlined, RollbackOutlined } from '@ant-design/icons';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import useMobx from '@/app/stores/root-store';
import SearchMenu from './SearchMenu.component';
import { formatDate } from './FormatDateAlgorithm';
import { InputNumber, Pagination } from 'antd';
import GetAllStreetcodesResponse from '@/models/streetcode/getAllStreetcodes.response';
import { Link } from 'react-router-dom';

const StreetcodesTable = () => {

    const [currentPagesAmount, setCurrentPagesAmount] = useState<number>(1);

    const [titleRequest, setTitleRequest] = useState<string|null>(null);
    const [statusRequest, setStatusRequest] = useState<string|null>(null);
    const [pageRequest, setPageRequest] = useState<number|null>(null);
    const [amountRequest, setAmountRequest] = useState<number|null>(null);

    const requestDefault: GetAllStreetcodesRequest = {
        Page: null,
        Amount: null,
        Title: null,
        Sort: null,
        Filter: null
    }

    const [requestGetAll, setRequestGetAll] = useState<GetAllStreetcodesRequest>(requestDefault);

    const setRequest = () => {
        setRequestGetAll({
            Page: pageRequest,
            Amount: amountRequest,
            Title: titleRequest == "" ? null : titleRequest,
            Sort: null,
            Filter: `Status:${statusRequest}`
        });
    }

    const { modalStore: { setModal } } = useMobx(); 
    
    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedStreetCode[]>([]);

    const DeleteAction = (record: MapedStreetCode) => {
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
            width: 500,
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
            width: 100,
            key: 'action',
            render: (value: any, record: MapedStreetCode, index: any) => 
            <>
                {record.status != "Видалений" ? 
                <>
                    <Link to={`/admin-panel/edit-streetcode/${record.key}`}>
                       <FormOutlined className='actionButton' onClick={(event) => { event.stopPropagation(); }} />
                    </Link>
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

        let getAllStreetcodesResponse = StreetcodesApi.getAll(requestGetAll);

        let mapedStreetCodes: MapedStreetCode[] = [];

        Promise.all([getAllStreetcodesResponse]).then(response => {
            response[0].streetcodes?.map((streetcode) => {
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
                setCurrentPagesAmount(response[0].pages)
        })
    }, [requestGetAll]); 

    return(
    <>
        <div className="StreetcodeTableWrapper">
            <SearchMenu setStatus={setStatusRequest} setTitle={setTitleRequest} setRequest={setRequest}/> 
            <div>
                <Table columns={columnsNames}
                dataSource={mapedStreetCodes}
                scroll={{ y: 440 }}
                pagination={false}
                onRow={(record: MapedStreetCode) => {
                    return {
                      onClick: () => window.open(`${FRONTEND_ROUTES.STREETCODE.BASE}/${record.index}`,'_blank')
                    }
                  }}
                />
            </div>
            <div>
                <div className='underTableZone'>
                    <div className='underTableElement'>
                        <InputNumber className='pageAmountElement' min={1} max={20} defaultValue={1} onChange={(value: any) => {
                            setAmountRequest(value)
                            }}/>
                    </div>
                    <div className='underTableElement'>
                        <Pagination className='pagenationElement' simple defaultCurrent={1} total={currentPagesAmount*10} onChange={(value: any) => {
                            setPageRequest(value);
                            setRequest();
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default StreetcodesTable;
