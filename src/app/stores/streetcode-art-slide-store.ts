import { makeAutoObservable } from 'mobx';
import StreetcodeArtApi from '@api/media/streetcode-art.api';
import { ModelState } from '@models/enums/model-state';
import { StreetcodeArtSlideAdmin } from '@models/media/streetcode-art-slide.model';

export default class StreetcodeArtSlideStore {
    public streetcodeArtSlides: StreetcodeArtSlideAdmin[] = new Array<StreetcodeArtSlideAdmin>();

    private startFromSlide = 1;

    private readonly amountOfSlides = 100;

    public constructor() {
        makeAutoObservable(this);
    }

    public hasArtWithId(id: string): boolean {
        if (this.streetcodeArtSlides.length === 0) return false;
        const isInSlides = this.streetcodeArtSlides.some((slide) => slide.streetcodeArts.some((sArt) => sArt.art.id == id));
        return isInSlides;
    }

    public fetchNextArtSlidesByStreetcodeId = async (streetcodeId: number) => {
        const arrayOfArtSlides = await StreetcodeArtApi
            .getArtSlidesByStreetcodeId(streetcodeId, this.startFromSlide, this.amountOfSlides);

        if (arrayOfArtSlides.length !== 0) {
            if (this.streetcodeArtSlides.length === 0) {
                this.streetcodeArtSlides.push(...arrayOfArtSlides.map((slide) => ({
                    ...slide,
                    modelState: ModelState.Updated,
                    isPersisted: true,
                })));
                this.startFromSlide += 1;
            }
        } else {
            throw new Error('No more arts to load');
        }
    };
}
