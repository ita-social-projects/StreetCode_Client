import './ArtGallerySlideItem.styles.scss';

import { IndexedArt } from '@models/media/art.model';

import useMobx from '@/app/stores/root-store';

interface Props {
  artGalleryItem: IndexedArt;
}

const ArtGallerySlideItem = ({ artGalleryItem }: Props) => {
    const { imageHref, description, title, sequenceNumber } = artGalleryItem;
    const { modalStore: { setModal } } = useMobx();

    return (
        <div className="slideArt">
            <div className="artImageWrapper">
                <img
                    className="imgImg"
                    src={imageHref}
                    onClick={() => setModal('artGallery', sequenceNumber)}
                    alt=""
                />
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
