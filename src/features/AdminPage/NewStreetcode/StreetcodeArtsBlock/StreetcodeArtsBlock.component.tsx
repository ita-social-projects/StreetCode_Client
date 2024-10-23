import React from 'react';

import DownloadBlock from './components/Download.component';

const StreetcodeArtsBlock = React.memo(() => (
    <div className="adminContainer-block">
        <h2>Арт-галерея</h2>
        <h3>Завантажити арти</h3>
        <DownloadBlock />
        <h4 className='adminContainer-red-h4'>* Зауважте, не використані арти видаляються</h4>
    </div>
));
export default StreetcodeArtsBlock;
