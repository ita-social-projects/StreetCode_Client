import './OneToTwoAndThreeToFourAndFiveSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';

const OneToTwoAndThreeToFourAndFiveSlide = (props: SlidePropsType) => (
    <BaseArtGallerySlide {...props} className="OneToTwoAndThreeToFourAndFiveSlide" />
);

export default OneToTwoAndThreeToFourAndFiveSlide;
