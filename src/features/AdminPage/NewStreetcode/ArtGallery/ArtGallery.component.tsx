import './ArtGallery.styles.scss';

import { IndexedArt } from '@/models/map/media/art.model';

import DownloadBlock from './components/Download.component';

interface Props {
    setIndexedArts: React.Dispatch<React.SetStateAction<IndexedArt[]>>;
}
const ArtGalleryBlock = () => (
    <div className="art-gallery-block">
        <div className="subheading">
            <h3>Арт-галерея</h3>
        </div>
        <h4>Завантажити арти</h4>
        <DownloadBlock />
    </div>
);

export default ArtGalleryBlock;
