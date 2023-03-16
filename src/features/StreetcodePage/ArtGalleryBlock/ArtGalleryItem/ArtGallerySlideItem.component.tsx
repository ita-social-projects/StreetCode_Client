import './ArtGallerySlideItem.styles.scss';

import { IndexedArt } from '@models/media/art.model';

import useMobx from '@/app/stores/root-store';

interface Props {
  artGalleryItem: IndexedArt;
  offset: number;
}
const ArtGallerySlideItem = ({ artGalleryItem, offset }: Props) => {
    console.log(offset);
    const { imageHref, description, title, sequenceNumber } = artGalleryItem;
    const { modalStore: { setModal } } = useMobx();

    return (
        <div className={`slideArt ${offset === 2 ? 'medium' : offset === 4 ? 'large' : 'small'}`}>
            <div className="artImageWrapper">
                <img
                    className={`imgImg ${offset === 2 ? 'two' : offset === 4 ? 'four' : 'one'}`}
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
