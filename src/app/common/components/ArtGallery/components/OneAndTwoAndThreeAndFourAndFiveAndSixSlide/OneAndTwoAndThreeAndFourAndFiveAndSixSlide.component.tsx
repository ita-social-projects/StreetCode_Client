import './OneAndTwoAndThreeAndFourAndFiveAndSixSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import StreetcodeArt from '@models/media/streetcode-art.model';

type Props = {
    streetcodeArts: StreetcodeArt[]
};
const OneAndTwoAndThreeAndFourAndFiveAndSixSlide = ({ streetcodeArts }: Props) => (
    <BaseArtGallerySlide streetcodeArts={streetcodeArts} className="OneAndTwoAndThreeAndFourAndFiveAndSixSlide" />
);

export default OneAndTwoAndThreeAndFourAndFiveAndSixSlide;
