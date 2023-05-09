import './Analytics.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { Table } from 'antd';

import StatisticRecordApi from '@/app/api/analytics/statistic-record.api';
import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';
import StatisticRecord from '@/models/analytics/analytics/statisticrecord.model';
import Streetcode from '@/models/streetcode/streetcode-types.model';

interface TableData {
    qrId: number,
    coordinates: string,
    address: string,
    count: number,
}

const columns = [
    {
        title: 'Адреса',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'К-сть переходів по QR коду',
        dataIndex: 'count',
        key: 'count',
    },
    {
        title: 'Номер QR',
        dataIndex: 'qrId',
        key: 'qrId',
    },
    {
        title: 'Координати',
        dataIndex: 'coordinates',
        key: 'coordinates',
    },
];

const handleTransformData = (records: StatisticRecord[]) => {
    const transformedData: Array<TableData> = [];
    records.forEach((record) => {
        transformedData.push({
            qrId: record.qrId,
            coordinates: `${record.streetcodeCoordinate.latitude}, ${record.streetcodeCoordinate.longtitude}`,
            address: record.address,
            count: record.count,
        } as TableData);
    });
    return transformedData;
};

const Analytics = () => {
    const id = +useRouteUrl();
    const [data, setData] = useState<TableData[]>();
    const [streetcode, setStreetcode] = useState<Streetcode>();

    const setTableState = async () => {
        if (id !== null) {
            await StatisticRecordApi.getAllByStreetcodeId(id).then((responce) => {
                const tempData = handleTransformData(responce);
                setData(tempData);
            });
        }
    };

    const setStreetcodeMain = async () => {
        if (id !== null) {
            await StreetcodesApi.getShortById(id).then((resp) => {
                setStreetcode(resp);
            });
        }
    };

    useEffect(() => {
        setStreetcodeMain();
        setTableState();
    }, [id]);

    return (
        <div className="analyticsWrapper">
            <h1>Аналітика</h1>
            <h2>
                Стріткод
                {' '}
                {streetcode?.title}
            </h2>
            <Table columns={columns} dataSource={data} />
        </div>
    );
};

export default observer(Analytics);
