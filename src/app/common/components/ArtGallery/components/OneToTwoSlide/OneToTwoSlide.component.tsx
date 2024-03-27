import './OneToTwoSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';

const OneToTwoSlide = (props: SlidePropsType) => (
    <BaseArtGallerySlide {...props} className="oneToTwoSlide" />
);

export default OneToTwoSlide;
