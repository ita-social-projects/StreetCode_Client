import './OneToTwoAndThreeToFourAndFiveToSixSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import StreetcodeArt from '@models/media/streetcode-art.model';

type Props = {
    streetcodeArts: StreetcodeArt[]
};
const OneToTwoAndThreeToFourAndFiveToSixSlide = ({ streetcodeArts }: Props) => (
    <BaseArtGallerySlide streetcodeArts={streetcodeArts} className="OneToTwoAndThreeToFourAndFiveToSixSlide" />
);

export default OneToTwoAndThreeToFourAndFiveToSixSlide;
