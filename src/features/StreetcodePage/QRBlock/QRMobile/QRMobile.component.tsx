import './QRMobile.styles.scss';

import { useMediaQuery } from 'react-responsive';

import { Button } from 'antd';

import { instagramClick } from '@/app/common/utils/googleAnalytics.unility';

const QRMobile = () => {
    const isMobile = useMediaQuery({
        query: '(max-width: 675px)',
    });

    return (
        <div className="QRMobileContainer">
            {!isMobile
                && (
                    <>
                        <div className="QRMobileGif">
                            <iframe
                                title="gif"
                                src="https://giphy.com/embed/11c7UUfN4eoHF6"
                                width="100%"
                                height="100%"
                            />
                        </div>
                        <div className="QRMobileContent">
                            <p className="arInstagram">AR-історія в Інсті!</p>
                            <p className="pressButtonText">
                                Тисни кнопку, фокусуй камеру на ілюстрації та вітай нову реальність.
                            </p>
                            <Button
                                className="goToInstaButton"
                                onClick={() => instagramClick('mobile')}
                            >
                                Перейти в Instagram
                            </Button>
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
                        <div className="QRMobileGif">
                            <iframe
                                title="gif"
                                src="https://giphy.com/embed/11c7UUfN4eoHF6"
                                width="340px"
                                height="323px"
                            />
                        </div>
                        <Button
                            className="goToInstaButton"
                            onClick={() => instagramClick('mobile')}
                        >
                            Перейти в Instagram
                        </Button>
                    </div>
                )}
        </div>
    );
};

export default QRMobile;
