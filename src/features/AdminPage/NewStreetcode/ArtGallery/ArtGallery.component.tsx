import './ArtGallery.styles.scss';

import { ArtCreate } from '@/models/media/art.model';

import DownloadBlock from './components/Download.component';

const ArtGalleryBlock: React.FC<{ arts:ArtCreate[],
    setArts: React.Dispatch<React.SetStateAction<ArtCreate[]>> }> = ({ arts, setArts }) => (
        <div className="art-gallery-block">
            <div className="subheading">
                <h3>Арт-галерея</h3>
            </div>
            <h4>Завантажити арти</h4>
            <DownloadBlock arts={arts} setArts={setArts} />
        </div>
    );
export default ArtGalleryBlock;
