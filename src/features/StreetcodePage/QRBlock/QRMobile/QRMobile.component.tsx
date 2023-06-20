import './QRMobile.styles.scss';

import { useMediaQuery } from 'react-responsive';

import { Button } from 'antd';

import { instagramOnStreetcodeClickEvent } from '@/app/common/utils/googleAnalytics.unility';

const QRMobile:React.FC<{ hrefLink:string }> = ({ hrefLink }) => {
    const isMobile = useMediaQuery({
        query: '(max-width: 715px)',
    });

    return (
        <div className="QRMobileContainer">
            {isMobile
                ? (
                    <div className="QRMobileContent">
                        <p className="arInstagram">AR—історія в Інсті!</p>
                        <p className="pressButtonText">
                            Тисни кнопку, фокусуй камеру на ілюстрації та вітай нову реальність.
                        </p>
                        <div className="QRMobileGif" />
                        <a href={hrefLink} target="_blank" rel="noreferrer">
                            <Button
                                className="goToInstaButton"
                                onClick={() => instagramOnStreetcodeClickEvent('mobile')}
                            >
                            Перейти в Instagram
                            </Button>
                        </a>
                    </div>
                ) : (
                    <>
                        <div className="QRMobileGif" />
                        <div className="QRMobileContent">
                            <p className="arInstagram">AR—історія в Інсті!</p>
                            <p className="pressButtonText">
                                Тисни кнопку, фокусуй камеру на ілюстрації та вітай нову реальність.
                            </p>
                            <a href={hrefLink} target="_blank" rel="noreferrer">
                                <Button
                                    className="goToInstaButton"
                                    onClick={() => instagramOnStreetcodeClickEvent('tablet')}
                                >
                                Перейти в Instagram
                                </Button>
                            </a>
                        </div>
                    </>
                )}
        </div>
    );
};

export default QRMobile;
