import './AboutUsPage.styles.scss';

import React, { useState } from 'react';

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
            </div>
            {hasVacancies && <TickerComponent type="teamMembers" />}
        </div>
    );
};
export default AboutUsPage;
