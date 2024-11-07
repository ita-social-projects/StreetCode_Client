/* eslint-disable complexity */
/* eslint-disable max-len */
import React from 'react';
import OneAndTwoAndThreeAndFourAndFiveAndSixSlide from '@components/ArtGallery/components/OneAndTwoAndThreeAndFourAndFiveAndSixSlide/OneAndTwoAndThreeAndFourAndFiveAndSixSlide.component';
import OneToFourAndFiveToSixSlide
    from '@components/ArtGallery/components/OneToFourAndFiveToSixSlide/OneToFourAndFiveToSixSlide.component';
import OneToFourSlide from '@components/ArtGallery/components/OneToFourSlide/OneToFourSlide.component';
import OneToTwoAndThreeToFourAndFiveToSixSlide from '@components/ArtGallery/components/OneToTwoAndThreeToFourAndFiveToSixSlide/OneToTwoAndThreeToFourAndFiveToSixSlide.component';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';
import { ArtSlideTemplateEnum } from '@models/enums/art-slide-template';
import StreetcodeArtSlide from '@models/media/streetcode-art-slide.model';

import OneAndTwoAndThreeAndFourSlide from '../components/OneAndTwoAndThreeAndFour/OneAndTwoAndThreeAndFourSlide.component';
import OneAndTwoAndThreeAndFourAndFiveSlide from '../components/OneAndTwoAndThreeAndFourAndFive/OneAndTwoAndThreeAndFourAndFiveSlide.component';
import OneAndTwoAndThreeToFourSlide from '../components/OneAndTwoAndThreeToFour/OneAndTwoAndThreeToFourSlide.component';
import OneAndTwoAndThreeToFourAndFiveSlide from '../components/OneAndTwoAndThreeToFourAndFive/OneAndTwoAndThreeToFourAndFiveSlide.component';
import OneAndTwoAndThreeToFourAndFiveAndSixSlide from '../components/OneAndTwoAndThreeToFourAndFiveAndSix/OneAndTwoAndThreeToFourAndFiveAndSixSlide.component';
import OneAndTwoAndThreeToFourAndFiveToSixSlide from '../components/OneAndTwoAndThreeToFourAndFiveToSix/OneAndTwoAndThreeToFourAndFiveToSixSlide.component';
import OneToFourAndFiveAndSixSlide from '../components/OneToFourAndFiveAndSixSlide/OneToFourAndFiveAndSixSlide.component';
import OneToTwoAndThreeToFourAndFiveSlide from '../components/OneToTwoAndThreeToFourAndFive/OneToTwoAndThreeToFourAndFiveSlide.component';
import OneToTwoAndThreeToFourSlide from '../components/OneToTwoAndThreeToFourSlide/OneToTwoAndThreeToFourSlide.component';
import OneToTwoSlide from '../components/OneToTwoSlide/OneToTwoSlide.component';

function getSlideTemplate(artSlide: StreetcodeArtSlide, isDroppable?: boolean, isAdmin?: boolean, isConfigurationGallery?: boolean) {
    const props: SlidePropsType = {
        key: artSlide.index.toString(),
        slideIndex: artSlide.index,
        streetcodeArts: artSlide.streetcodeArts,
        artSlideId: artSlide.template,
        isDroppable: isDroppable || false,
        isAdmin: isAdmin || false,
        isConfigurationGallery: isConfigurationGallery || false,
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

    case ArtSlideTemplateEnum.OneToTwo:
        return <OneToTwoSlide {...props} />;

    case ArtSlideTemplateEnum.OneToTwoAndThreeToFour:
        return <OneToTwoAndThreeToFourSlide {...props} />;

    case ArtSlideTemplateEnum.OneToFourAndFiveAndSix:
        return <OneToFourAndFiveAndSixSlide {...props} />;

    case ArtSlideTemplateEnum.OneAndTwoAndThreeToFour:
        return <OneAndTwoAndThreeToFourSlide {...props} />;

    case ArtSlideTemplateEnum.OneAndTwoAndThreeAndFour:
        return <OneAndTwoAndThreeAndFourSlide {...props} />;

    case ArtSlideTemplateEnum.OneToTwoAndThreeToFourAndFive:
        return <OneToTwoAndThreeToFourAndFiveSlide {...props} />;

    case ArtSlideTemplateEnum.OneAndTwoAndThreeToFourAndFiveToSix:
        return <OneAndTwoAndThreeToFourAndFiveToSixSlide {...props} />;

    case ArtSlideTemplateEnum.OneAndTwoAndThreeToFourAndFive:
        return <OneAndTwoAndThreeToFourAndFiveSlide {...props} />;

    case ArtSlideTemplateEnum.OneAndTwoAndThreeToFourAndFiveAndSix:
        return <OneAndTwoAndThreeToFourAndFiveAndSixSlide {...props} />;

    case ArtSlideTemplateEnum.OneAndTwoAndThreeAndFourAndFive:
        return <OneAndTwoAndThreeAndFourAndFiveSlide {...props} />;

    default:
        return <div>No template error</div>;
    }
}

export default function convertSlidesToTemplates(artSlides: StreetcodeArtSlide[], isDroppable?: boolean, isAdmin?: boolean, isConfigurationGallery?: boolean): JSX.Element[] {
    return artSlides?.map((slide) => getSlideTemplate(slide, isDroppable, isAdmin, isConfigurationGallery));
}
