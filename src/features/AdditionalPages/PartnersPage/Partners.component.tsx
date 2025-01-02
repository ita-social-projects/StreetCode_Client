import './Partners.styles.scss';

import { Helmet } from 'react-helmet';

import DonateBtnRectangle from './ModalButtons/DonateBtn/DonateBtnRectangle.component';
import PartnersBtn from './ModalButtons/PartnersBtn/PartnersBtn.component';
import PartnersBtnCircle from './ModalButtons/PartnersBtnCircle/PartnersBtnCircle.component';
import PartnersBlock from './PartnersBlock/PartnersBlock.component';
import Title from './Title/Title.component';

const PartnersPage = () => (

    <>
        <Helmet>
            <title>Наші партнери | Historycode</title>
            <meta name="description" content="Дізнайтеся про наших цінних партнерів, що вклали внесок у нашу місію." />
        </Helmet>
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
            </div>
        </div>
        <div className="sticky">
            <div className="sticky-content">
                <PartnersBtnCircle />
            </div>
        </div>
    </>
);

export default PartnersPage;
