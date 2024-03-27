import { ArtSlideTemplateEnum } from '@models/enums/art-slide-template';
import StreetcodeArt from '@models/media/streetcode-art.model';

type SlidePropsType = {
    key: string,
    streetcodeArts: StreetcodeArt[],
    artSlideId: ArtSlideTemplateEnum,
    isDroppable: boolean,
    isAdmin?: boolean,
    slideIndex: number,
};

export default SlidePropsType;
