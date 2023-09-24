import './AboutUsPage.styles.scss';

import React, { useState } from 'react';
import HeaderLoginModal from '@components/modals/HeaderLogin/HeaderLoginModal.component';

import TickerComponent from '../StreetcodePage/TickerBlock/Ticker.component';

import AboutUsHeaderText from './AboutUsHeaderText/AboutUsHeaderText.component';
import Founders from './Founders/Founders.component';
import TeamMembers from './TeamMembers/TeamMembers.component';
import Vacancies from './Vacancies/Vacancies.component';

const AboutUsPage = () => {
    const [hasVacancies, setHasVacancies] = useState(false);
    console.log('hasVacancies AboutUs', hasVacancies);

    return (
        <div className="aboutUsPageContainer">
            <div className="contentContainer">
                <AboutUsHeaderText />
                <Founders />
                <TeamMembers />
                <Vacancies setHasVacancies={setHasVacancies} />
                <HeaderLoginModal hasVacancies={hasVacancies} />
            </div>
            {hasVacancies && <TickerComponent type="teamMembers" />}
            <HeaderLoginModal hasVacancies={hasVacancies} />
        </div>
    );
};
export default AboutUsPage;
