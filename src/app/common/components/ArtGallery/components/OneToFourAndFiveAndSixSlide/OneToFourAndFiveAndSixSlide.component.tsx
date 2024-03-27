import './OneToFourAndFiveAndSixSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';

const OneToFourAndFiveAndSixSlide = (props: SlidePropsType) => (
    <BaseArtGallerySlide {...props} className="OneToFourAndFiveAndSixSlide" />
);

export default OneToFourAndFiveAndSixSlide;
