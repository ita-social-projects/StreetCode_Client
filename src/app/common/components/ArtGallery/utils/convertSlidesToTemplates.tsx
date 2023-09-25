/* eslint-disable max-len */
import OneAndTwoAndThreeAndFourAndFiveAndSixSlide from '@components/ArtGallery/components/OneAndTwoAndThreeAndFourAndFiveAndSixSlide/OneAndTwoAndThreeAndFourAndFiveAndSixSlide.component';
import OneToFourSlide from '@components/ArtGallery/components/OneToFourSlide/OneToFourSlide.component';
import OneToTwoAndThreeToFourAndFiveToSixSlide from '@components/ArtGallery/components/OneToTwoAndThreeToFourAndFiveToSixSlide/OneToTwoAndThreeToFourAndFiveToSixSlide.component';
import Droppable from '@components/Droppable/Droppable';
import { ArtSlideTemplateEnum } from '@models/enums/art-slide-template';
import StreetcodeArtSlide from '@models/media/streetcode-art-slide.model';

function getSlideTemplate(artSlide: StreetcodeArtSlide) {
    switch (artSlide.template) {
    case ArtSlideTemplateEnum.OneToFour:
        return <OneToFourSlide key={artSlide.index} streetcodeArts={artSlide.streetcodeArts} />;

    case ArtSlideTemplateEnum.OneToTwoAndThreeToFourAndFiveToSix:
        return (
            <OneToTwoAndThreeToFourAndFiveToSixSlide
                key={artSlide.index}
                streetcodeArts={artSlide.streetcodeArts}
            />
        );

    case ArtSlideTemplateEnum.OneToFourAndFiveToSix:
        return <div>OneToFourAndFiveToSix template</div>;

    case ArtSlideTemplateEnum.OneAndTwoAndThreeAndFourAndFiveAndSix:
        return (
            <OneAndTwoAndThreeAndFourAndFiveAndSixSlide
                key={artSlide.index}
                streetcodeArts={artSlide.streetcodeArts}
            />
        );

    default:
        return <div>No template error</div>;
    }
}

export default function convertSlidesToTemplates(artSlides: StreetcodeArtSlide[], isDroppable?: boolean): JSX.Element[] {
    return artSlides?.map((slide) => (isDroppable
        ? <Droppable id={slide.template.toString()}>{getSlideTemplate(slide)}</Droppable>
        : getSlideTemplate(slide)));
}
