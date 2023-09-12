import { makeAutoObservable } from 'mobx';
import StreetcodeArtApi from '@api/media/streetcode-art.api';
import StreetcodeArt, { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';
import StreetcodeArtSlide, {StreetcodeArtSlideCreateUpdate} from "@models/media/streetcode-art-slide.model"

export default class StreetcodeArtStore {
    public streetcodeArtSlides: StreetcodeArtSlide[] = new Array<StreetcodeArtSlide>();

    private startFromSlide = 1;

    private readonly amountOfSlides = 1;

    public constructor() {
        makeAutoObservable(this);
    }

    get getStreetcodeArtArray(): StreetcodeArt[]{
        const arts:StreetcodeArt[]  = []
        this.streetcodeArtSlides.forEach(slide => {
            arts.push(...slide.streetcodeArts)
        })
        return arts
    }
    get getStreetcodeArtsToDelete() {
        // return (this.streetcodeArtSlides as StreetcodeArtSlideCreateUpdate[])
        //     .filter((art) => art.modelState === ModelState.Deleted);
        return [];
    }

    public fetchNextArtSlidesByStreetcodeId = async (streetcodeId: number) => {
        const arrayOfArtSlides = await StreetcodeArtApi
            .getArtSlidesByStreetcodeId(streetcodeId, this.startFromSlide, this.amountOfSlides);
        console.log("slides: ", arrayOfArtSlides);
        if (arrayOfArtSlides.length !== 0) {
            this.streetcodeArtSlides.push(...arrayOfArtSlides)
            this.startFromSlide += 1;
        } else {
            throw new Error('No more arts to load');
        }
    };
}
