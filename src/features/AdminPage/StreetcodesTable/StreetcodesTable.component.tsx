import './StreetcodesTable.styles.scss';
import StreetcodesApi from "@/app/api/streetcode/streetcodes.api";
import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import Streetcode from "@/models/streetcode/streetcode-types.model";
import Table from "antd/es/table/Table";
import { useEffect, useState } from "react";

// interface Props {
//     streetcodes: Streetcode[]
// }

const StreetcodesTable = () => {

    const { value } = useAsync(() => StreetcodesApi.getAll(), []);
    const streetcodes = value as Streetcode[];

    const columnsNames = [
        {
            title: 'Назва стріткоду',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Номер стріткоду',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
        }
    ]

    interface MapedStreetCode {
        key: number,
        index: string,
        status: string,
        name: string
    }

    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedStreetCode[]>([]);

    useEffect(() => {

        let mapedStreetCodes: MapedStreetCode[] = [];

        streetcodes?.map((streetcode) => {

            let mapedStreetCode = {
                key: streetcode.id,
                index: `000${streetcode.index}`,
                status: "Чернетка",
                name: "Title"
            }
            
            mapedStreetCodes.push(mapedStreetCode);

            console.log(streetcode)
        });
        
        setMapedStreetCodes(mapedStreetCodes)
    }, streetcodes);

    return(
    <>
        <div className="StreetcodeTableWrapper">
            <Table columns={columnsNames}
             dataSource={mapedStreetCodes}
             pagination={false}/>
        </div>
    </>);
}

export default StreetcodesTable;