/* eslint-disable max-len */
import OneAndTwoAndThreeAndFourAndFiveAndSixSlide from '@components/ArtGallery/components/OneAndTwoAndThreeAndFourAndFiveAndSixSlide/OneAndTwoAndThreeAndFourAndFiveAndSixSlide.component';
import OneToFourAndFiveToSixSlide
    from '@components/ArtGallery/components/OneToFourAndFiveToSixSlide/OneToFourAndFiveToSixSlide.component';
import OneToFourSlide from '@components/ArtGallery/components/OneToFourSlide/OneToFourSlide.component';
import OneToTwoAndThreeToFourAndFiveToSixSlide from '@components/ArtGallery/components/OneToTwoAndThreeToFourAndFiveToSixSlide/OneToTwoAndThreeToFourAndFiveToSixSlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';
import { ArtSlideTemplateEnum } from '@models/enums/art-slide-template';
import StreetcodeArtSlide from '@models/media/streetcode-art-slide.model';

function getSlideTemplate(artSlide: StreetcodeArtSlide, isDroppable?: boolean, isAdmin?: boolean) {
    const props: SlidePropsType = {
        key: artSlide.index.toString(),
        slideIndex: artSlide.index,
        streetcodeArts: artSlide.streetcodeArts,
        artSlideId: artSlide.template,
        isDroppable: isDroppable || false,
        isAdmin: isAdmin || false,
    };

    switch (artSlide.template) {
    case ArtSlideTemplateEnum.OneToFour:
        return <OneToFourSlide {...props} />;

    case ArtSlideTemplateEnum.OneToTwoAndThreeToFourAndFiveToSix:
        return <OneToTwoAndThreeToFourAndFiveToSixSlide {...props} />;

    case ArtSlideTemplateEnum.OneToFourAndFiveToSix:
        return <OneToFourAndFiveToSixSlide {...props} />;

    case ArtSlideTemplateEnum.OneAndTwoAndThreeAndFourAndFiveAndSix:
        return <OneAndTwoAndThreeAndFourAndFiveAndSixSlide {...props} />;

    default:
        return <div>No template error</div>;
    }
}

export default function convertSlidesToTemplates(artSlides: StreetcodeArtSlide[], isDroppable?: boolean, isAdmin?: boolean): JSX.Element[] {
    return artSlides?.map((slide) => getSlideTemplate(slide, isDroppable, isAdmin));
}
