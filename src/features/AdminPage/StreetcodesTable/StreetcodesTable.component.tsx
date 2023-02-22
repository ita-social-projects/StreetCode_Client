import './StreetcodesTable.styles.scss';
import StreetcodesApi from "@/app/api/streetcode/streetcodes.api";
import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import Streetcode from "@/models/streetcode/streetcode-types.model";
import Table from "antd/es/table/Table";
import { useEffect, useState } from "react";
import { Button } from 'antd';

// interface Props {
//     streetcodes: Streetcode[]
// }

const StreetcodesTable = () => {

    const { value } = useAsync(() => StreetcodesApi.getAll(), []);
    const streetcodes = value as Streetcode[];

    const fullMonthNumericYearDateFmtr = new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const formatDate = (date?: Date): string => fullMonthNumericYearDateFmtr.format(date).replace('р.', 'року');

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
        }
    ]

    interface MapedStreetCode {
        key: number,
        index: string,
        stage: string,
        date: string,
        name: string
    }

    const [mapedStreetCodes, setMapedStreetCodes] = useState<MapedStreetCode[]>([]);

    useEffect(() => {

        let mapedStreetCodes: MapedStreetCode[] = [];

        streetcodes?.map((streetcode) => {

            let mapedStreetCode = {
                key: streetcode.id,
                index: `000${streetcode.index}`,
                stage: streetcode.stage == 0 ? "Чернетка" : "Опублікований",
                date: formatDate(new Date(streetcode.updatedAt)),
                name: "Григорович Тарас Шевченко"
            }
            
            // let mapedStreetCode2 = {
            //     key: streetcode.id,
            //     index: `000${streetcode.index}`,
            //     stage: streetcode.stage == 0 ? "Чернетка" : "Опублікований",
            //     name: "Григорович Тарас Шевченко"
            // }

            mapedStreetCodes.push(mapedStreetCode);
            // mapedStreetCodes.push(mapedStreetCode2);
            // console.log(formatDate(new Date(streetcode.updatedAt)))
        });
        
        setMapedStreetCodes(mapedStreetCodes)
    }, streetcodes);

    return(
    <>
        <div className="StreetcodeTableWrapper">
            <Button className='addButton'>Новий стріткод</Button>
            <Table columns={columnsNames}
             dataSource={mapedStreetCodes}
             pagination={{className: "pagination", pageSize: 8}}
            />
        </div>
    </>);
}

export default StreetcodesTable;