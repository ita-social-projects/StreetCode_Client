import './ArtGalleryListOfItem.styles.scss';

import ArtGalleryItem from '@streetcode/ArtGallery/ArtGalleryItem/ArtGalleryItem.component';

interface Props {
    images: string[];
}

const ArtGalleryListOfItem = ({ images }: Props) => (
    <div className="slideArt">
        {images?.map((image) => (
            <ArtGalleryItem image={image} />
        ))}
    </div>
);

export default ArtGalleryListOfItem;
