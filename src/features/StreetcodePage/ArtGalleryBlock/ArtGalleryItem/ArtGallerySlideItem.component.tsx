import './ArtGallerySlideItem.styles.scss';

import { IndexedArt } from '@models/media/art.model';

import useMobx from '@/app/stores/root-store';

interface Props {
  artGalleryItem: IndexedArt,
  offset: number,
  isAdminPage?: boolean
}
const ArtGallerySlideItem = ({ artGalleryItem, offset, isAdminPage }: Props) => {
    console.log(offset);
    const { imageHref, description, title, sequenceNumber } = artGalleryItem;
    const { modalStore: { setModal } } = useMobx();

    function setStyleByOffset(offset : number) : string {
        switch (offset) {
        case 1:
            return 'small';
        case 2:
            return 'medium';
        case 4:
            return 'large';
        }
    }
    //${offset === 2 ? 'medium' : offset === 4 ? 'large' : 'small'}
    //${offset === 2 ? 'two' : offset === 4 ? 'four' : 'one'}
    //${setStyleByOffset(offset)}
    return (
        <div className={isAdminPage ? `slideArtAdmin  ${setStyleByOffset(offset)}` :
         `slideArt ${setStyleByOffset(offset)}`}>
            <div className={isAdminPage ? `artImageWrapperAdmin`:`artImageWrapper`}>
                <img
                    className={`imgImg ${setStyleByOffset(offset)}`}
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
