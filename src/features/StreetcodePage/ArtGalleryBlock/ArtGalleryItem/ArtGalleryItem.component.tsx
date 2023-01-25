import './ArtGalleryItem.styles.scss';

import { IndexedArt } from '@models/media/art.model';

interface Props {
  artGalleryItem: IndexedArt;
}

const ArtGalleryItem = ({ artGalleryItem }: Props) => {
    const { imageHref, description, title } = artGalleryItem;
    return (
        <div className="slideArt">
            <div className="imgWrap">
                <img className="imgImg" src={imageHref} alt="" />
                <div
                    className={`imgData imgData${
                        !description && !title ? 'Empty' : 'Full'
                    }`}
                >
                    <p className="imgTitle">{title}</p>
                    <p className="imgDescription">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default ArtGalleryItem;
