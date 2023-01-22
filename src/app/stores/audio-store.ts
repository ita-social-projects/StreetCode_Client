import { makeAutoObservable, runInAction } from 'mobx';
import audiosApi from '@api/media/audios.api';
import Audio from '@models/media/audio.model';

export default class AudioStore {
    public Audio: Audio | undefined;

    public constructor() {
        makeAutoObservable(this);
    }

    private setItem = (audio: Audio | undefined) => {
        this.Audio = audio;
    };

    public fetchAudio = async (id: number) => {
        try {
            const audio = await audiosApi.getById(id);
            runInAction(() => {
                this.setItem(audio as Audio);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchAudioByStreetcodeId = async (streetcodeId: number) => {
        try {
            const audio = await audiosApi.getByStreetcodeId(streetcodeId);
            runInAction(() => {
                this.setItem(audio as Audio);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createAudio = async (audio: Audio) => {
        try {
            await audiosApi.create(audio);
            runInAction(() => {
                this.setItem(audio as Audio);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateAudio = async (audio: Audio) => {
        try {
            await audiosApi.update(audio);
            runInAction(() => {
                this.setItem(audio as Audio);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteAudio = async (audioId: number) => {
        try {
            await audiosApi.delete(audioId);
            runInAction(() => {
                this.setItem(undefined);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
