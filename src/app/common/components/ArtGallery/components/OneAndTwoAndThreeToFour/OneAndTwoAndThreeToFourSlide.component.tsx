import './OneAndTwoAndThreeToFourSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';

const OneAndTwoAndThreeToFourSlide = (props: SlidePropsType) => (
    <BaseArtGallerySlide {...props} className="OneAndTwoAndThreeToFourSlide" />
);

export default OneAndTwoAndThreeToFourSlide;
