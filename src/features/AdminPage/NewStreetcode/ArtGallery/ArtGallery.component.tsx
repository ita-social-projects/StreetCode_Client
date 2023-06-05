import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';

import DownloadBlock from './components/Download.component';

const ArtGalleryBlock: React.FC<{
    arts: StreetcodeArtCreateUpdate[],
    setArts: React.Dispatch<React.SetStateAction<StreetcodeArtCreateUpdate[]>>
}> = ({ arts, setArts }) => (
    <div className="adminContainer-block">
        <h2>Арт—галерея</h2>
        <h3>Завантажити арти</h3>
        <DownloadBlock arts={arts} setArts={setArts} />
    </div>
);
export default ArtGalleryBlock;
