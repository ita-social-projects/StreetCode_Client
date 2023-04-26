import './RedirectPage.styles.scss';

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StatisticRecordApi from '@api/analytics/statistic-record.api';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';

const RedirectPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const checkExist = async (qrId: number) => {
        const exist = await StatisticRecordApi.existByQrId(qrId);
        return exist;
    };

    const redirect = async (qrId: number) => {
        const url = await StreetcodesApi.getUrlByQrId(qrId);
        await StatisticRecordApi.update(qrId);
        return url;
    };

    useEffect(() => {
        const idParam = searchParams.get('id') ?? '-1';
        const tempId = +idParam;
        Promise.all([checkExist(tempId), redirect(tempId)]).then(
            (resp) => {
                if (resp.at(0) && resp.at(1) !== null) {
                    const urlString = resp.at(1);
                    navigate(`/streetcode/${urlString}`, { replace: true });
                }
            },
        ).catch(
            () => {
                navigate('/404', { replace: true });
            },
        );
    });

    return (
        <div>
            <p>Redirect...</p>
        </div>
    );
};

export default RedirectPage;
