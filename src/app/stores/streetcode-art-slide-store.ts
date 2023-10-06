import { makeAutoObservable } from 'mobx';
import StreetcodeArtApi from '@api/media/streetcode-art.api';
import { ModelState } from '@models/enums/model-state';
import { StreetcodeArtSlideCreateUpdate } from '@models/media/streetcode-art-slide.model';

import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';

export default class StreetcodeArtSlideStore {
    public streetcodeArtSlides: StreetcodeArtSlideCreateUpdate[] = new Array<StreetcodeArtSlideCreateUpdate>();

    private startFromSlide = 1;

    private readonly amountOfSlides = 100;

    public constructor() {
        makeAutoObservable(this);
    }

    get getStreetcodeArtArray(): StreetcodeArtCreateUpdate[] {
        const artsFromSlides: StreetcodeArtCreateUpdate[] = [];

        this.streetcodeArtSlides.forEach((slide) => {
            slide.streetcodeArts.forEach((sArt) => {
                if (!artsFromSlides.some((existingArt) => existingArt.art.id === sArt.art.id)) {
                    artsFromSlides.push(sArt);
                }
            });
        });

        return artsFromSlides;
    }

    public hasArtWithId(id: string): boolean {
        if (this.streetcodeArtSlides.length === 0) return false;
        const isInSlides = this.streetcodeArtSlides.some((slide) => slide.streetcodeArts.some((sArt) => sArt.art.id == id));
        console.log(`ID: ${id} IsInSlides: ${isInSlides}`);
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
