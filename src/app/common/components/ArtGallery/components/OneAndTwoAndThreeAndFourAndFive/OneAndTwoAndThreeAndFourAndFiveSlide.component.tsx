import './OneAndTwoAndThreeAndFourAndFiveSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';

const OneAndTwoAndThreeAndFourAndFiveSlide = (props: SlidePropsType) => (
    <BaseArtGallerySlide {...props} className="OneAndTwoAndThreeAndFourAndFiveSlide" />
);

export default OneAndTwoAndThreeAndFourAndFiveSlide;
