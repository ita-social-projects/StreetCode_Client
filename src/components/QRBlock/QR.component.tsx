import "./QR.styles.scss"
let IPhone = require("../../assets/images/QR_Iphone.png");
let QR = require("../../assets/images/QR.png");
interface Props {

}

const QRComponent = ({  }: Props) => {
    return (
        <div className={"QRBlockContainer"}>
            <div className={"QRBlockContent"}>
                <div className={"QRBlockImg"}>
                    <img src={IPhone} />
                </div>
                <div className={"QRBlockText"}>
                    <div className={"QRBlockTextWrapper"}>
                    <h1>AR-історія в Інсті!</h1>
                    <p>Переходь за QR-кодом, фокусуй камеру <br/>на ілюстрації та вітай нову реальність.</p>
                    <p className={"p_bold"}>Скануй, щоб завіртуалити історію!</p>
                    <img src={QR}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QRComponent;