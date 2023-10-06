import React from 'react';

import DownloadBlock from './components/Download.component';

const ArtGalleryBlock = React.memo(() => (
    <div className="adminContainer-block">
        <h2>Арт-галерея</h2>
        <h3>Завантажити арти</h3>
        <DownloadBlock />
    </div>
));
export default ArtGalleryBlock;
