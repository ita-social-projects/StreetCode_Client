import { makeAutoObservable } from 'mobx';
import allSlidesTemplates from '@components/ArtGallery/constants/allSlidesTemplates';
import { ArtSlideTemplateEnum } from '@models/enums/art-slide-template';
import Art from '@models/media/art.model';
import StreetcodeArtSlide from '@models/media/streetcode-art-slide.model';

export default class ArtGalleryTemplateStore {
    public streetcodeArtSlides: StreetcodeArtSlide[] = allSlidesTemplates;

    public isEdited = false;

    public constructor() {
        makeAutoObservable(this);
    }

    public setArtInSlide(slideTemplate: ArtSlideTemplateEnum, artIndex: number, art: Art) {
        const existingSlideIndex = this.streetcodeArtSlides.findIndex((s) => s.template === slideTemplate);

        const existingArtIndex = this.streetcodeArtSlides[existingSlideIndex]
            .streetcodeArts.findIndex((a) => a.index === artIndex);

        this.streetcodeArtSlides[existingSlideIndex].streetcodeArts[existingArtIndex].art = art;

        if (!this.isEdited) {
            this.isEdited = true;
        }
    }
}
