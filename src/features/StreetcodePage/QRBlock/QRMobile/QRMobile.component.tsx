import './QRMobile.styles.scss';

import { useMediaQuery } from 'react-responsive';

import { Button } from 'antd';

import { instagramOnStreetcodeClickEvent } from '@/app/common/utils/googleAnalytics.unility';

const QRMobile: React.FC<{ hrefLink: string }> = ({ hrefLink }) => {
    const isMobile = useMediaQuery({
        query: '(max-width: 715px)',
    });

    if (!hrefLink) {
        return null;
    }

    const handleClick = () => instagramOnStreetcodeClickEvent(isMobile ? 'mobile' : 'tablet');

    return (
        <div className="QRMobileContainer">
            <div className="QRMobileContent">
                <p className="arInstagram">AR-історія в Інсті!</p>
                <p className="pressButtonText">
                    Тисни кнопку та вітай нову реальність.
                </p>
                <a href={hrefLink} target="_blank" rel="noreferrer">
                    <Button
                        className="goToInstaButton"
                        onClick={handleClick}
                    >
                        Перейти в Instagram
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default QRMobile;
