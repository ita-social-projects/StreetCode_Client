import './QRMobile.styles.scss';

import { useMediaQuery } from 'react-responsive';
import QRGif from '@assets/images/qr-block/must_be _gif.png';

import { Button } from 'antd';

interface Props {

}

const QRMobile = (props: Props) => {
    const isMobile = useMediaQuery({
        query: '(max-width: 715px)',
    });

    return (
        <div className="QRMobileContainer">
            {!isMobile
                && (
                    <>
                        <div className="QRMobileGif" />
                        <div className="QRMobileContent">
                            <p className="arInstagram">AR-історія в Інсті!</p>
                            <p className="pressButtonText">
                                Тисни кнопку, фокусуй камеру на ілюстрації та вітай нову реальність.
                            </p>
                            <Button className="goToInstaButton">Перейти в Instagram</Button>
                        </div>
                    </>
                )}
            {isMobile
                && (
                    <div className="QRMobileContent">
                        <p className="arInstagram">AR-історія в Інсті!</p>
                        <p className="pressButtonText">
                            Тисни кнопку, фокусуй камеру на ілюстрації та вітай нову реальність.
                        </p>
                        <div className="QRMobileGif" />
                        <Button className="goToInstaButton">Перейти в Instagram</Button>
                    </div>
                )}
        </div>
    );
};

export default QRMobile;
