import './PrivatePolicy.styles.scss';

import { useEffect } from 'react';
import Footer from '@layout/footer/Footer.component';

import SectionFifth from './SubSections/SubSectionFifth/SectionFifth.component';
import SectionFirst from './SubSections/SubSectionFirst/SectionFirst.component';
import SectionFourth from './SubSections/SubSectionFourth/SectionFourth.component';
import SectionSecond from './SubSections/SubSectionSecond/SectionSecond.component.tsx';
import SectionSeventh from './SubSections/SubSectionSeventh/SectionSeventh.component';
import SectionSixth from './SubSections/SubSectionSixth/SectionSixth.component';
import SectionThird from './SubSections/SubSectionThird/SectionThird.component';
import Title from './Title/Title.component';

const PrivatePolicy = () => (
    <div className="privatePolicyContainer">
        <div className="wrapper">
            <Title />
            <main>
                <SectionFirst />
                <SectionSecond />
                <SectionThird />
                <SectionFourth />
                <SectionFifth />
                <SectionSixth />
                <SectionSeventh />
            </main>
        </div>
    </div>
);

export default PrivatePolicy;
