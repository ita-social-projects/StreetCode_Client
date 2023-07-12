import { makeAutoObservable } from 'mobx';

import { AudioUpdate } from '@/models/media/audio.model';
import { ImageUpdate } from '@/models/media/image.model';

export default class CreateUpdateMediaStore {
    public animationId: number | null = null;

    public blackAndWhiteId: number | null = null;

    public relatedFigureId: number | null = null;

    public audioId: number | null = null;

    public imagesUpdate: ImageUpdate[] = [];

    public audioUpdate: AudioUpdate[] = [];

    public constructor() {
        makeAutoObservable(this);
    }
}
