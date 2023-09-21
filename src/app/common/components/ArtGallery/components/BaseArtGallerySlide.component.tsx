import './BaseArtGallerySlide.styles.scss';

import StreetcodeArt from '@models/media/streetcode-art.model';
import base64ToUrl from '@utils/base64ToUrl.utility';

type Props = {
    streetcodeArts: StreetcodeArt[],
    className: string
};
const BaseArtGallerySlide = ({ streetcodeArts, className }: Props) => (
    <div className={`${className} base-art-slide`}>
        {streetcodeArts?.map((streetcodeArt) => {
            const { image } = streetcodeArt.art;
            return (
                <img
                    className="base-art-image"
                    src={base64ToUrl(image.base64, image.mimeType)}
                    alt={image.imageDetails?.title}
                />
            );
        })}
    </div>
);

export default BaseArtGallerySlide;
