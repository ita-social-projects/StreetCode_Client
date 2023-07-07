import React from 'react';

import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';

import DownloadBlock from './components/Download.component';

interface Props {
    arts: StreetcodeArtCreateUpdate[],
    setArts: React.Dispatch<React.SetStateAction<StreetcodeArtCreateUpdate[]>>,
    onChange: (field: string, value: any) => void,
}

const ArtGalleryBlock = React.memo(({ arts, setArts, onChange }: Props) => (
    <div className="adminContainer-block">
        <h2>Арт—галерея</h2>
        <h3>Завантажити арти</h3>
        <DownloadBlock arts={arts} setArts={setArts} onChanges={onChange} />
    </div>
));
export default ArtGalleryBlock;
