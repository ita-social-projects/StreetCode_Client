import './Analytics.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { Table } from 'antd';

import StatisticRecordApi from '@/app/api/analytics/statistic-record.api';
import ImagesApi from '@/app/api/media/images.api';
import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import PageBar from '@/features/AdminPage/PageBar/PageBar.component';
import StatisticRecord from '@/models/analytics/analytics/statisticrecord.model';
import Image from '@/models/media/image.model';
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
    const [img, setImage] = useState<Image>();

    const setTableState = async (streetcodeId: number) => {
        await StatisticRecordApi.getAllByStreetcodeId(streetcodeId).then((responce) => {
            const tempData = handleTransformData(responce);
            setData(tempData);
        });
    };

    const setStreetcodeMain = async (streetcodeId: number) => {
        await StreetcodesApi.getShortById(streetcodeId).then((resp) => {
            setStreetcode(resp);
        });
    };

    const setImages = async (streetcodeId: number) => {
        await ImagesApi.getByStreetcodeId(streetcodeId ?? 1).then((imgs) => {
            setImage(imgs.at(0));
        }).catch((e) => {
            console.log(e);
        });
    };

    useEffect(() => {
        if (id) {
            Promise.all([setStreetcodeMain(id), setTableState(id), setImages(id)]);
        }
    }, [id]);

    return (
        <div className="analyticsWrapper">
            <PageBar />
            <div className="analyticsInfoWrapper">
                <div className="analyticsGridView">
                    <div className="streetcodeImgWrapper">
                        <h2 className="streetcodeName">
                            Стріткод
                            <br />
                            {streetcode?.title}
                        </h2>
                        <img
                            key={img?.id}
                            src={base64ToUrl(img?.base64, img?.mimeType)}
                            className="streetcodeImg"
                            alt={img?.alt}
                        />
                    </div>
                    <div className="statisticTableWrapper">
                        <h2 className="streetcodeName">
                            Статистика
                        </h2>
                        <Table columns={columns} dataSource={data} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(Analytics);
