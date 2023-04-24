import Table from "antd/es/table/Table";
import { useEffect, useState } from "react";
import { Button, InputNumber, Pagination } from 'antd';
import { Checkbox } from 'antd';
import ToponymsApi from '@/app/api/map/toponyms.api';
import GetAllToponyms from '@/models/toponyms/getAllToponyms.request';
import SearchMenu from './SearchMenu.component';
import './StatisticsToponymsAdmin.styles.scss'
import GetAllToponymsRequest from "@/models/toponyms/getAllToponyms.request";

const StatisticsToponymsComponentAdmin = () => {
    const [titleRequest, setTitleRequest] = useState<string|null>(null);
    const [pageRequest, setPageRequest] = useState<number|null>(null);
    const [amountRequest, setAmountRequest] = useState<number|null>(null);

    const requestDefault: GetAllToponymsRequest  = {
        Title: "Шевченк",
        Page: null,
        Amount: null
    }
    const [requestGetAll, setRequestGetAll] = useState<GetAllToponyms>(requestDefault);
    const setRequest = () => {
        setRequestGetAll({
            Page: pageRequest,
            Amount: amountRequest,
            Title: titleRequest == "" ? null : titleRequest,
        });
    }
    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedToponyms[]>([]);

    const columnsNames = [
      {
        title: ' ',
        key: 'checkbox',
        width: 6,
        render: () => <Checkbox />,
      },
        {
            title: 'Топонім',
            dataIndex: 'streetName',
            width: 150,
            key: 'streetName'
        },

    ]
    interface MapedToponyms {
        key: number|undefined,
        streetName: string|undefined,
    }

    useEffect(() => {

        let getAllToponymsResponse  = ToponymsApi.getAll(requestGetAll);

        let mapedStreetCodes: MapedToponyms[] = [];

         Promise.all([getAllToponymsResponse]).then(response => {
            response[0].toponyms?.map((toponym) => {             

                    let mapedStreetCode = {
                        key: toponym.id,
                        streetName: toponym.streetName,

                    }

                    mapedStreetCodes.push(mapedStreetCode);
                });

                setMapedStreetCodes(mapedStreetCodes)
        })
    }, [requestGetAll]); 

      return(
    <>
        <div className="ToponymsTableWrapper">
            <SearchMenu setTitle={setTitleRequest} setRequest={setRequest}/> 
            <div>
                <Table columns={columnsNames}
                dataSource={mapedStreetCodes}
                scroll={{ y: 440 }}
                pagination={false}
                />
            </div>
            <div>
                <div className='underTableZone'>
                <Button className='ButtonAddAllToponyms'>Додати обрані</Button>
                </div>
            </div>
        </div>
    </>);
}
export default StatisticsToponymsComponentAdmin;