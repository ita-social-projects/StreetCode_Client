import './OneAndTwoAndThreeToFourAndFiveSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';

const OneAndTwoAndThreeToFourAndFiveSlide = (props: SlidePropsType) => (
    <BaseArtGallerySlide {...props} className="OneAndTwoAndThreeToFourAndFiveSlide" />
);

export default OneAndTwoAndThreeToFourAndFiveSlide;
