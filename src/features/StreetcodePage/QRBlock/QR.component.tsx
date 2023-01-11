import './QR.styles.scss';

import QRCodeImg from '@images/qr-block/QR.png';
import IPhoneImg from '@images/qr-block/QR_Iphone.png';

interface Props {

}

const QRComponent = (props: Props) => (
    <div className="QRBlockContainer">
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
                    <img src={QRCodeImg} alt="" />
                </div>
            </div>
        </div>
    </div>
);

export default QRComponent;
