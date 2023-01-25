import './ArtGalleryListOfItem.styles.scss';

import { IndexedArt } from '@models/media/art.model';
import ArtGalleryItem from '@streetcode/ArtGalleryBlock/ArtGalleryItem/ArtGalleryItem.component';

interface Props {
  artGalleryList: IndexedArt[];
}

const ArtGalleryListOfItem = ({ artGalleryList }: Props) => {
    let offsetSum = 0;
    artGalleryList.map((item) => (offsetSum += item.offset));
    return (
        <div className="slideArtGalleryContainer">
            <div className={`slideArtGallery width-${offsetSum > 4 ? 2 : 1}`}>
                {artGalleryList.map((item) => (
                    <ArtGalleryItem artGalleryItem={item} />
                ))}
            </div>
        </div>
    );
};

export default ArtGalleryListOfItem;
