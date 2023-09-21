import './OneToFourSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import StreetcodeArt from '@models/media/streetcode-art.model';

type Props = {
    streetcodeArts: StreetcodeArt[]
};
const OneToFourSlide = ({ streetcodeArts }: Props) => (
    <BaseArtGallerySlide streetcodeArts={streetcodeArts} className="oneToFourSlide" />
);

export default OneToFourSlide;
