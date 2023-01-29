import './ArtGallerySlideItem.styles.scss';

import { IndexedArt } from '@models/media/art.model';

interface Props {
  artGalleryItem: IndexedArt;
}

const ArtGallerySlideItem = ({ artGalleryItem }: Props) => {
    const { imageHref, description, title } = artGalleryItem;
    return (
        <div className="slideArt">
            <div className="artImageWrapper">
                <img className="imgImg" src={imageHref} alt="" />
                <div
                    className={`imgData imgData${
                        description || title ? 'Full' : 'Empty'
                    }`}
                >
                    <p className="imgTitle">{title}</p>
                    <p className="imgDescription">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default ArtGallerySlideItem;
