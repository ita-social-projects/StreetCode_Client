import { makeAutoObservable, observable } from 'mobx';
import allSlidesTemplates, { TEMPLATE_IMAGE_BASE64 } from '@components/ArtGallery/constants/allSlidesTemplates';
import { ArtSlideTemplateEnum } from '@models/enums/art-slide-template';
import Art from '@models/media/art.model';
import { StreetcodeArtSlideAdmin } from '@models/media/streetcode-art-slide.model';

export default class ArtGalleryTemplateStore {
    public streetcodeArtSlides: StreetcodeArtSlideAdmin[] = [...allSlidesTemplates];

    public isEdited = false;

    public constructor() {
        makeAutoObservable(this);
    }

    public setArtInSlide(slideTemplate: ArtSlideTemplateEnum, artIndex: number, art: Art) {
        if ((slideTemplate == null || undefined) || !artIndex) return;

        const existingSlideIndex = this.streetcodeArtSlides.findIndex((s) => s.template === slideTemplate);

        if (existingSlideIndex === -1) return;

        const existingArtIndex = this.streetcodeArtSlides[existingSlideIndex]
            ?.streetcodeArts.findIndex((a) => a.index === artIndex);

        if (existingArtIndex === -1) return;

        const updatedArtSlide = { ...this.streetcodeArtSlides[existingSlideIndex] };
        updatedArtSlide.streetcodeArts[existingArtIndex].art = art;

        this.streetcodeArtSlides[existingSlideIndex] = updatedArtSlide;

        if (!this.isEdited) {
            this.isEdited = true;
        }
    }

    public clearTemplates() {
        this.streetcodeArtSlides = [...allSlidesTemplates];
        this.isEdited = false;
    }

    public getEditedSlide() {
        const editedSlide = this.streetcodeArtSlides.find(
            (slide) => slide.streetcodeArts.some(
                (sArt) => sArt.art.image.base64 !== TEMPLATE_IMAGE_BASE64,
            ),
        );
        this.clearTemplates();

        return { ...editedSlide };
    }

    public hasArtWithId(id: string): boolean {
        if (this.streetcodeArtSlides.length === 0) return false;
        const isInSlides = this.streetcodeArtSlides.some((slide) => slide.streetcodeArts.some((sArt) => sArt.art.id == id));
        return isInSlides;
    }
}
