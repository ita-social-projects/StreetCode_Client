import './ArtGallerySlideItem.styles.scss';

import { IndexedArt } from '@models/media/art.model';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import useMobx, { useAdditionalContext, useModalContext } from '@/app/stores/root-store';

interface Props {
    artGalleryItem: IndexedArt,
    offset: number,
    isAdminPage?: boolean
}
const ArtGallerySlideItem = ({ artGalleryItem, offset, isAdminPage }: Props) => {
    const { imageHref, description, title, sequenceNumber } = artGalleryItem;
    const { modalStore: { setModal } } = useModalContext();
    const windowsize = useWindowSize();

    function setStyleByOffset(offset: number): string {
        switch (offset) {
            case 1:
                return 'small';
            case 2:
                return 'medium';
            case 4:
                return 'large';
        }
    }

    return (
        <div className={isAdminPage ? `slideArtAdmin  ${setStyleByOffset(offset)}`
            : `slideArt ${setStyleByOffset(offset)}`}
        >
            <div className={isAdminPage ? 'artImageWrapperAdmin' : 'artImageWrapper'}>
                <div className={`artContainer ${setStyleByOffset(offset) }`}>
                    <img
                        className={`imgImg ${setStyleByOffset(offset)}`}
                        src={imageHref}
                        onClick={isAdminPage ? null : () => setModal('artGallery', sequenceNumber)}
                        alt=""
                    />
                    {windowsize.width > 1024 && (
                        <div
                            className={`imgData imgData${description || title ? 'Full' : 'Empty'
                                }`}
                        >
                            <p className="imgTitle">{title}</p>
                            <p className="imgDescription">{description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtGallerySlideItem;
