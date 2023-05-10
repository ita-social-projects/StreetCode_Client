import { useState } from 'react';
import './Analytics.styles.scss';

import { Table } from 'antd';

const columns = [
    {
        title: 'Номер QR',
        dataIndex: 'qrId',
        key: 'qrId',
    },
    {
        title: 'Назва стріткоду',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Адреса',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'К-сть переходів по QR коду',
        dataIndex: 'address',
        key: 'address',
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];

const Analytics = () => {
    const [fetchedData, setFetchedData] = useState();

    return (
        <div className="analyticsWrapper">
            <h1>Аналітика</h1>
            <Table columns={columns} dataSource={data} />
        </div>
    );
};

export default Analytics;