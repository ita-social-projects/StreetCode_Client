import './AboutUsPage.styles.scss';

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import AboutUsHeaderText from './AboutUsHeaderText/AboutUsHeaderText.component';
import Founders from './Founders/Founders.component';
import TeamMembers from './TeamMembers/TeamMembers.component';
import Vacancies from './Vacancies/Vacancies.component';

const AboutUsPage = () => {
    const [hasVacancies, setHasVacancies] = useState(false);
    const location = useLocation();
    const section = location.hash.substring(1);
    console.log('section:', section);

    useEffect(() => {
        const scrollToSection = (sectionName: string) => {
            const sectionElement = document.getElementById(sectionName);
            if (sectionElement) {
                sectionElement.scrollIntoView({ behavior: 'smooth' });
            }
        };

        if (section === 'vacancies') {
            scrollToSection('vacancies-section');
        } else {
            window.scrollTo(0, 0);
        }
    }, [section]);

    return (
        <div className="aboutUsPageContainer">
            <Helmet>
                <title>Про нас | Streetcode</title>
                <meta name="description" content="Дізнайтеся більше про «Стріткод», нашу місію, цінності та команду." />
            </Helmet>
            <div className="contentContainer">
                <AboutUsHeaderText />
                <Founders />
                <TeamMembers />
                <div id="vacancies-section">
                    <Vacancies setHasVacancies={setHasVacancies} />
                </div>
            </div>
        </div>
    );
};
export default AboutUsPage;
