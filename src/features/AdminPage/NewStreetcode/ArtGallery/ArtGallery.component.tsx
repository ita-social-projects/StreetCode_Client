import './ArtGallery.styles.scss';

import { IndexedArt } from '@/models/map/media/art.model';

import DownloadBlock from './components/Download.component';

interface Props {
    indexedArts: IndexedArt[],
    setIndexedArts: React.Dispatch<React.SetStateAction<IndexedArt[]>>;
}
const ArtGalleryBlock = ({ indexedArts, setIndexedArts }: Props) => (
    <div className="art-gallery-block">
        <div className="subheading">
            <h3>Арт-галерея</h3>
        </div>
        <h4>Завантажити арти</h4>
        <DownloadBlock indexedArts={indexedArts} setIndexedArts={setIndexedArts} />
    </div>
);

export default ArtGalleryBlock;
