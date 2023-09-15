import OneToFourSlide from '@components/ArtGallery/components/OneToFourSlide/OneToFourSlide.component';
import { ArtSlideTemplateEnum } from '@models/enums/art-slide-template';
import StreetcodeArtSlide from '@models/media/streetcode-art-slide.model';

function getSlideTemplate(artSlide: StreetcodeArtSlide) {
    switch (artSlide.template) {
    case ArtSlideTemplateEnum.OneToFour:
        return <OneToFourSlide key={artSlide.index} streetcodeArts={artSlide.streetcodeArts} />;
    case ArtSlideTemplateEnum.OneToTwoAndThreeToFourAndFiveToSix:
        return <div>OneToTwoAndThreeToFourAndFiveToSix template</div>;
    case ArtSlideTemplateEnum.OneToFourAndFiveToSix:
        return <div>OneToFourAndFiveToSix template</div>;
    case ArtSlideTemplateEnum.OneAndTwoAndFourAndFiveAndSix:
        return <div>OneAndTwoAndFourAndFiveAndSix template</div>;
    default:
        return <div>No template</div>;
    }
}

export default function convertSlidesToTemplates(artSlides: StreetcodeArtSlide[]): JSX.Element[] {
    return artSlides?.map((slide) => getSlideTemplate(slide));
}
