import './BaseArtGallerySlide.styles.scss';

import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';
import Droppable from '@components/Droppable/Droppable';
import base64ToUrl from '@utils/base64ToUrl.utility';

const BaseArtGallerySlide = ({ streetcodeArts, className, artSlideId, isDroppable }: SlidePropsType & { className: string }) => (
    <div className={`${className} base-art-slide`}>
        {streetcodeArts?.map((streetcodeArt) => {
            const { image } = streetcodeArt.art;
            const imageJSX = (
                <img
                    className="base-art-image"
                    src={base64ToUrl(image.base64, image.mimeType)}
                    alt={image.imageDetails?.title}
                />
            );

            return isDroppable
                ? <Droppable id={`${artSlideId}-${streetcodeArt.index}`}>{imageJSX}</Droppable>
                : imageJSX;
        })}
    </div>
);

export default BaseArtGallerySlide;
