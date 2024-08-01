import { makeAutoObservable, toJS } from 'mobx';
import StreetcodeArtApi from '@api/media/streetcode-art.api';
import { ModelState } from '@models/enums/model-state';
import StreetcodeArtSlide,
{
    StreetcodeArtSlideAdmin,
    StreetcodeArtSlideCreateUpdate,
} from '@models/media/streetcode-art-slide.model';
import { bindStreetcodeIdToDefaultSlide } from '../common/components/ArtGallery/constants/allSlidesTemplates';
import artGalleryTemplateStore from './art-gallery-template-store';

export default class StreetcodeArtSlideStore {
    public streetcodeArtSlides: StreetcodeArtSlideAdmin[] = new Array<StreetcodeArtSlideAdmin>();

    public streetcodeWasFetched: Array<number> = new Array<number>();

    private startFromSlide = 1;
    public isArtInSlideByRedact = false;

    public readonly amountOfSlides = 2;
    static isArtInSlideByRedact: boolean;

    public constructor() {
        makeAutoObservable(this);
    }

    public hasArtWithId(id: string, except?: number): boolean {
        if (this.streetcodeArtSlides.length === 0) return false;

        const isInSlides = this.getVisibleSortedSlidesWithoutParam()?.some(
            (slide) => (slide.streetcodeArts.some(
                (sArt) => sArt.art.id.toString() === id,
            ) && (slide.index - 1) !== except),
        );
        return isInSlides;
    }

    public findBySlideIndex(index: number) {
        return this.streetcodeArtSlides.find((s) => (s.index === index));
    }

    public getVisibleSortedSlides(streetcodeIdSlide: number) {
        return this.streetcodeArtSlides
            .filter((slide) => {
                return (
                    slide.modelState !== ModelState.Deleted && (streetcodeIdSlide === undefined || slide.streetcodeId === streetcodeIdSlide)
                );
            })
            .sort((a, b) => {
                return a.index - b.index;
            });
    }
    public getVisibleSortedSlidesWithoutParam() {
        return this.streetcodeArtSlides
            .filter((slide) => slide.modelState !== ModelState.Deleted)
            .sort((a, b) => (a.index > b.index ? 1 : -1));
    }

    public setStartingSlideAndId = (streetcodeId: number) => {
        this.startFromSlide = 1;
        this.streetcodeWasFetched.push(streetcodeId);
    };

    public fetchNextArtSlidesByStreetcodeId = async (streetcodeid: number) => {
        if (!this.streetcodeWasFetched.includes(streetcodeid)) {
            const arrayOfArtSlides = await StreetcodeArtApi
                .getArtSlidesByStreetcodeId(streetcodeid, this.startFromSlide, this.amountOfSlides);
            if (arrayOfArtSlides.length !== 0) {
                this.streetcodeArtSlides.push(...arrayOfArtSlides.map((slide: StreetcodeArtSlide) => ({
                    ...slide,
                    modelState: ModelState.Updated,
                    isPersisted: true,
                    streetcodeId: streetcodeid,
                    streetcodeArts: slide.streetcodeArts.sort((a, b) => (a.index > b.index ? 1 : -1)),
                })));

                this.startFromSlide += 1;
            } else {
                throw new Error('No more arts to load');
            }
        }
    };

    public fetchAllToDefaultTemplate = async (streetcodeId: number): Promise<number | void> => {
        if (this.streetcodeWasFetched.includes(streetcodeId)) {return;}
        const startingPosition = this.streetcodeArtSlides.length;
        const slidesCount = await StreetcodeArtApi.getAllCountByStreetcodeId(streetcodeId)
        const placeholders = new Array<StreetcodeArtSlideAdmin>(slidesCount).fill(bindStreetcodeIdToDefaultSlide(streetcodeId), 0, slidesCount);
        this.streetcodeArtSlides.push(...placeholders); 
        return startingPosition;
    }

    public fetchAllArtSlidesByStreetcodeId = async (streetcodeid: number, startIndex: number) => {
        if (!this.streetcodeWasFetched.includes(streetcodeid)) {
            const arrayOfArtSlides = await StreetcodeArtApi
                .getArtSlidesByStreetcodeId(streetcodeid, this.startFromSlide, this.amountOfSlides);
            if (arrayOfArtSlides.length !== 0) {
                arrayOfArtSlides.forEach((value) => {
                    this.streetcodeArtSlides[startIndex] = value;
                    startIndex++;
                })
                this.startFromSlide += 1;
            } else {
                throw new Error('No more arts to load');
            }
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
                    streetcodeId: slide.streetcodeId,
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
