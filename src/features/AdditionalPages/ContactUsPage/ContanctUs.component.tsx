import './ContactUs.styles.scss';

import Footer from '@layout/footer/Footer.component';

import MainBlock from './MainBlock/MainBlock.component';
import Title from './Title/Title.component';
import { Button } from 'antd';
const SURVEY_LINK = 'https://forms.gle/eWwX5RP84X7dymLR6';
const ContactUs = () => (
    
    <div className="contactUsContainer">
        <div className="contactUsCover">
            <div className="wrapper">
                <Title />
                <MainBlock />
                <div className="contactUsContent">
                <h1>Привіт, стріткодере/ко!</h1>
                <br />
                <h3>Цей сайт для тебе. Створений і наповнений з любов'ю, з історією та про історію. Наразі він працює в тестовому режимі. So, we need your help 😊</h3>
                <br />
                <h3>Пройди, будь ласка, коротеньке опитування, вкажи нам про всі зручності/незручності, баги/спотикачки і що ще тобі муляє. Це допоможе нам зробити сайт максимально user-friendly!</h3>
                <br />
                <h3>Зазнач в опитуванні електронну пошту, і ми подякуємо тобі креативним стікерпаком для сториз!</h3>
                <br />
                <Button className="contactUsBtnContainer" onClick={() => open(SURVEY_LINK)}>
                    <a>Пройти опитування</a>
                </Button>
        </div>
            </div>
        </div>
    </div>
);

export default ContactUs;
