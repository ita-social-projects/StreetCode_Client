import './OneToFourSlide.styles.scss';

import BaseArtGallerySlide from '@components/ArtGallery/components/BaseArtGallerySlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';

const OneToFourSlide = (props: SlidePropsType) => (
    <BaseArtGallerySlide {...props} className="oneToFourSlide" />
);

export default OneToFourSlide;
