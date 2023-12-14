import { makeAutoObservable } from 'mobx';

import { ModelState } from '@/models/enums/model-state';
import { AudioUpdate } from '@/models/media/audio.model';
import Image, { ImageAssigment, ImageCreateUpdate, ImageDetails } from '@/models/media/image.model';

export default class CreateUpdateMediaStore {
    public animationId: number | null = null;

    public blackAndWhiteId: number | null = null;

    public relatedFigureId: number | null = null;

    public audioId: number | null = null;

    public imagesUpdate: ImageCreateUpdate[] = [];

    public audioUpdate: AudioUpdate[] = [];

    public constructor() {
        makeAutoObservable(this);
    }

    public getImageIds(): number[] {
        return this.getImageDetails().map((x) => x.imageId);
    }

    public getImageDetails(): ImageDetails[] {
        const details:ImageDetails[] = [];
        if (this.animationId) {
            details.push({ id: 0, imageId: this.animationId, alt: ImageAssigment.animation.toString() });
        }
        if (this.blackAndWhiteId) {
            details.push({ id: 0, imageId: this.blackAndWhiteId, alt: ImageAssigment.blackandwhite.toString() });
        }
        if (this.relatedFigureId) {
            details.push({ id: 0, imageId: this.relatedFigureId, alt: ImageAssigment.relatedfigure.toString() });
        }
        return details;
    }

    public getImageDetailsUpdate():ImageDetails[] {
        const details = this.imagesUpdate
            .filter((image) => image.modelState === ModelState.Updated && image.imageDetails)
            .map((image) => image.imageDetails!);
        const curDetails = this.getImageDetails();
        curDetails.forEach((detail) => {
            const det = details.find((d) => detail.imageId === d.imageId);
            if (!det) {
                details.push(detail);
            }
        });

        return details;
    }
}
