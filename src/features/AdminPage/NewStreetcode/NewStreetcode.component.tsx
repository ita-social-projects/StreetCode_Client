import './NewStreetcode.styles.scss';

import React from 'react';

// eslint-disable-next-line no-restricted-imports
import PageBar from '../PageBar/PageBar.component';

import Addnewmainblock from './MainBlock/AddNewMainblock';

const NewStreetcode = () => (
    <div className="NewStreetcodeContainer">
        <PageBar />
        <Addnewmainblock />
    </div>
);

export default NewStreetcode;
