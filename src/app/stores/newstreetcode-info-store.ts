import { makeAutoObservable } from 'mobx';

import { AudioUpdate } from '@/models/media/audio.model';
import { ImageCreateUpdate, ImageUpdate } from '@/models/media/image.model';
import { ToponymCreateUpdate } from '@/models/toponyms/toponym.model';

export default class NewStreetcodeInfoStore {
    public animationId: number | null = null;

    public blackAndWhiteId: number | null = null;

    public relatedFigureId: number | null = null;

    public audioId: number | null = null;

    public arUrl: string | null = null;

    public selectedToponyms: ToponymCreateUpdate[] = [];

    public imagesUpdate: ImageUpdate[] = [];

    public audioDelete: AudioUpdate[] = [];

    public constructor() {
        makeAutoObservable(this);
    }

    set SelectedToponyms(toponyms: ToponymCreateUpdate[]) {
        this.selectedToponyms = toponyms;
    }
}
