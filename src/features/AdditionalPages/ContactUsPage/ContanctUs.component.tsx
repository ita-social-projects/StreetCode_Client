import './ContactUs.styles.scss';

import Footer from '@layout/footer/Footer.component';

import MainBlock from './MainBlock/MainBlock.component';
import Title from './Title/Title.component';

const ContactUs = () => (
    <div className="contactUsContainer">
        <div className="contactUsCover">
            <div className="wrapper">
                <Title />
                <MainBlock />
            </div>
        </div>
    </div>
);

export default ContactUs;
