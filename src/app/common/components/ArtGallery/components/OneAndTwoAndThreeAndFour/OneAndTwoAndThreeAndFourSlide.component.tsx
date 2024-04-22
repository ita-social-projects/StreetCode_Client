import './OneAndTwoAndThreeAndFourSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';

const OneAndTwoAndThreeAndFourSlide = (props: SlidePropsType) => (
    <BaseArtGallerySlide {...props} className="OneAndTwoAndThreeAndFourSlide" />
);

export default OneAndTwoAndThreeAndFourSlide;
