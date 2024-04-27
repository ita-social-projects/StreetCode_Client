import { makeAutoObservable, toJS } from 'mobx';
import StreetcodeArtApi from '@api/media/streetcode-art.api';
import { ModelState } from '@models/enums/model-state';
import StreetcodeArtSlide,
{
    StreetcodeArtSlideAdmin,
    StreetcodeArtSlideCreateUpdate,
} from '@models/media/streetcode-art-slide.model';

export default class StreetcodeArtSlideStore {
    public streetcodeArtSlides: StreetcodeArtSlideAdmin[] = new Array<StreetcodeArtSlideAdmin>();

    private startFromSlide = 1;

    public readonly amountOfSlides = 2;

    public constructor() {
        makeAutoObservable(this);
    }

    public hasArtWithId(id: string): boolean {
        if (this.streetcodeArtSlides.length === 0) return false;

        const isInSlides = this.getVisibleSortedSlides()?.some(
            (slide) => slide.streetcodeArts.some(
                (sArt) => sArt.art.id.toString() === id,
            ),
        );

        return isInSlides;
    }

    public findBySlideIndex(index: number) {
        return this.streetcodeArtSlides.find((s) => (s.index === index));
    }

    public getVisibleSortedSlides() {
        return this.streetcodeArtSlides
            .filter((slide) => slide.modelState !== ModelState.Deleted)
            .sort((a, b) => (a.index > b.index ? 1 : -1));
    }

    public fetchNextArtSlidesByStreetcodeId = async (streetcodeId: number) => {
        const arrayOfArtSlides = await StreetcodeArtApi
            .getArtSlidesByStreetcodeId(streetcodeId, this.startFromSlide, this.amountOfSlides);

        if (arrayOfArtSlides.length !== 0) {
            this.streetcodeArtSlides.push(...arrayOfArtSlides.map((slide:StreetcodeArtSlide) => ({
                ...slide,
                modelState: ModelState.Updated,
                isPersisted: true,
                streetcodeArts: slide.streetcodeArts.sort((a, b) => (a.index > b.index ? 1 : -1)),
            })));

            this.startFromSlide += 1;
        } else {
            throw new Error('No more arts to load');
        }
    };

    public getArtSlidesAsDTO(): StreetcodeArtSlideCreateUpdate[] {
        return this.streetcodeArtSlides
            .sort((a, b) => (a.index > b.index ? 1 : -1))
            .map((slide, idx) => {
                const convertedSlide = {
                    ...slide,
                    index: idx + 1,
                    isPersisted: null,
                    streetcodeArts: slide.streetcodeArts.map((streetcodeArt) => ({
                        index: streetcodeArt.index,
                        artId: streetcodeArt.art.id,
                    })),
                };

                if (convertedSlide.streetcodeId === -1) {
                // @ts-ignore
                    convertedSlide.streetcodeId = null;
                }

                return convertedSlide as unknown as StreetcodeArtSlideCreateUpdate;
            });
    }
}
