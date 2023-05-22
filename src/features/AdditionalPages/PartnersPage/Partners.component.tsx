import './Partners.styles.scss';

import Footer from '@layout/footer/Footer.component';

import DonateBtnRectangle from './ModalButtons/DonateBtn/DonateBtnRectangle.component';
import PartnersBtn from './ModalButtons/PartnersBtn/PartnersBtn.component';
import PartnersBtnCircle from './ModalButtons/PartnersBtnCircle/PartnersBtnCircle.component';
import PartnersBlock from './PartnersBlock/PartnersBlock.component';
import Title from './Title/Title.component';

const PartnersPage = () => (
    <>
        <div className="partnersContainer">
            <div className="wrapper">
                <Title />
                <PartnersBlock />
                <div className="subTitle titleBottom">
                Тобі чи твоїй компанії відгукується наш проєкт?
                Наперед тиснемо руку та мріємо про спільну залученість. Приєднуйся!
                </div>
                <div className="buttonsContainer">
                    <div className="buttonsBlock">
                        <PartnersBtn />
                        <DonateBtnRectangle />
                    </div>
                </div>
                <PartnersBtnCircle />
            </div>
        </div>
        <Footer />
    </>
);

export default PartnersPage;
