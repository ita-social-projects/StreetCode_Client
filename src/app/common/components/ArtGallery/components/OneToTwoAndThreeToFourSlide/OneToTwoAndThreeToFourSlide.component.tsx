import './OneToTwoAndThreeToFourSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';

const OneToTwoAndThreeToFourSlide = (props: SlidePropsType) => (
    <BaseArtGallerySlide {...props} className="OneToTwoAndThreeToFourSlide" />
);

export default OneToTwoAndThreeToFourSlide;
