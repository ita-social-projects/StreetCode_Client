import './ArtGallerySlide.styles.scss';

import { IndexedArt } from '@models/media/art.model';
import ArtGallerySlideItem from '@streetcode/ArtGalleryBlock/ArtGalleryItem/ArtGallerySlideItem.component';

interface Props {
    artGalleryList: IndexedArt[];
    isAdminPage?: boolean,
}

const ArtGallerySlide = ({ artGalleryList, isAdminPage }: Props) => {
    const offsetSum = artGalleryList.reduce((accumulator, currentValue) => accumulator + currentValue.offset, 0);
    return (
        <div className={isAdminPage ? 'slideArtGalleryContainerAdmin' : 'slideArtGalleryContainer'}>
            <div className={`slideArtGallery width-${offsetSum > 4 ? 2 : 1}`}>
                {artGalleryList.map((item) => (
                    <ArtGallerySlideItem
                        key={item.index}
                        artGalleryItem={item}
                        offset={item.offset}
                        isAdminPage={isAdminPage}
                    />
                ))}
            </div>
        </div>
    );
};

export default ArtGallerySlide;
