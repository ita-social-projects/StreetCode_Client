import './QR.styles.scss';

import QR from '@assets/images/QR.png';
import IPhone from '@assets/images/QR_Iphone.png';

interface Props {

}

const QRComponent = (props: Props) => (
  <div className="QRBlockContainer">
    <div className="QRBlockContent">
      <div className="QRBlockImg">
        <img src={IPhone} alt="" />
      </div>
      <div className="QRBlockText">
        <div className="QRBlockTextWrapper">
          <h1>AR-історія в Інсті!</h1>
          <p>
            Переходь за QR-кодом, фокусуй камеру
            <br />
            на ілюстрації та вітай нову реальність.
          </p>
          <p className="pBold">Скануй, щоб завіртуалити історію!</p>
          <img src={QR} alt="" />
        </div>
      </div>
    </div>
  </div>
    );

export default QRComponent;
