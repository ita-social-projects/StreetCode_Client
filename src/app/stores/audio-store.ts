import { makeAutoObservable, runInAction } from 'mobx';
import audiosApi from '@api/media/audios.api';
import Audio, { AudioCreate } from '@models/media/audio.model';

export default class AudioStore {
    public audio: Audio | undefined;

    public constructor() {
        makeAutoObservable(this);
    }

    public setItem = (audio: Audio | undefined) => {
        this.audio = audio;
    };

    public fetchAudioByStreetcodeId = async (streetcodeId: number):Promise<Audio | undefined> => {
        try {
            return await audiosApi.getByStreetcodeId(streetcodeId).then((audio) => {
                this.setItem(audio); return audio;
            });
        } catch (error: unknown) {}
    };

    public createAudio = async (audio: AudioCreate) => {
        try {
            await audiosApi.create(audio).then((newAudio) => this.setItem(newAudio));
        } catch (error: unknown) { }
    };

    public updateAudio = async (audio: Audio) => {
        try {
            await audiosApi.update(audio);
            runInAction(() => {
                this.setItem(audio as Audio);
            });
        } catch (error: unknown) {}
    };

    public deleteAudio = async (audioId: number) => {
        try {
            await audiosApi.delete(audioId);
            runInAction(() => {
                this.setItem(undefined);
            });
        } catch (error: unknown) {}
    };
}
