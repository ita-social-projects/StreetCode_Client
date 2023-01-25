import './ArtGallerySlide.styles.scss';

import { IndexedArt } from '@models/media/art.model';
import ArtGallerySlideItem from '@streetcode/ArtGalleryBlock/ArtGalleryItem/ArtGallerySlideItem.component';

interface Props {
  artGalleryList: IndexedArt[];
}

const ArtGallerySlide = ({ artGalleryList }: Props) => {
    const offsetSum = artGalleryList.reduce((accumulator, currentValue) => accumulator + currentValue.offset, 0);

    return (
        <div className="slideArtGalleryContainer">
            <div className={`slideArtGallery width-${offsetSum > 4 ? 2 : 1}`}>
                {artGalleryList.map((item) => (
                    <ArtGallerySlideItem artGalleryItem={item} />
                ))}
            </div>
        </div>
    );
};

export default ArtGallerySlide;
