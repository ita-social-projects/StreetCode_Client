import './QR.styles.scss';

import QRCodeImg from '@images/qr-block/QR.png';
import IPhoneImg from '@images/qr-block/QR_Iphone.png';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { QRCode } from 'antd';

import TransactionLinksApi from '@/app/api/transactions/transactLinks.api';
import { useStreetcodeDataContext } from '@/app/stores/root-store';
import TransactionLink from '@/models/transactions/transaction-link.model';

import QRMobile from './QRMobile/QRMobile.component';

const QRComponent = () => {
    const isDesktop = useMediaQuery({
        query: '(min-width: 1025px)',
    });
    const [qrUrl, setQrUrl] = useState<TransactionLink>();
    const { streetcodeStore: { getStreetCodeId } } = useStreetcodeDataContext();
    useEffect(() => {
        if (getStreetCodeId && getStreetCodeId >= 1) {
            TransactionLinksApi.getByStreetcodeId(getStreetCodeId).then((res) => setQrUrl(res));
        }
    }, [getStreetCodeId]);

    return (

        qrUrl
            ? (
                <div id="QRBlock" className="QRBlockContainer container">
                    {isDesktop
                        ? (
                            <div className="QRBlockContent">
                                <div className="QRBlockImg">
                                    <img src={IPhoneImg} alt="" />
                                </div>
                                <div className="QRBlockText">
                                    <div className="QRBlockTextContainer">
                                        <h1>AR-історія в Інсті!</h1>
                                        <p>

            Переходь за QR-кодом, фокусуй камеру
                                            <br />
            на ілюстрації та вітай нову реальність.
                                        </p>
                                        <p className="appealPrg">Скануй, щоб завіртуалити історію!</p>
                                        <QRCode value={qrUrl.url ?? ''} />
                                    </div>
                                </div>
                            </div>
                        ) : <QRMobile hrefLink={qrUrl.url} />}

                </div>
            ) : <></>
    );
};

export default QRComponent;
