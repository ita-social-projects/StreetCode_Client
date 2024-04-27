import './OneToFourAndFiveToSixSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';

const OneToFourAndFiveToSixSlide = (props: SlidePropsType) => (
    <BaseArtGallerySlide {...props} className="OneToFourAndFiveToSixSlide" />
);

export default OneToFourAndFiveToSixSlide;
