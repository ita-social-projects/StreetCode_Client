import { makeAutoObservable, runInAction } from 'mobx';
import audiosApi from '@api/media/audios.api';
import Audio from '@models/media/audio.model';

export default class AudioStore {
    public AudioMap = new Map<number, Audio>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (audios: Audio[]) => {
        audios.forEach(this.setItem);
    };

    private setItem = (audio: Audio) => {
        this.AudioMap.set(audio.id, audio);
    };

    public getAudioArray = () => Array.from(this.AudioMap.values());

    public fetchAudio = async (id: number) => {
        try {
            const audio = await audiosApi.getById(id);
            this.setItem(audio);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchAudios = async () => {
        try {
            const audios = await audiosApi.getAll();
            this.setInternalMap(audios);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createAudio = async (audio: Audio) => {
        try {
            await audiosApi.create(audio);
            this.setItem(audio);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateAudio = async (audio: Audio) => {
        try {
            await audiosApi.update(audio);
            runInAction(() => {
                const updatedAudio = {
                    ...this.AudioMap.get(audio.id),
                    ...audio,
                };
                this.setItem(updatedAudio as Audio);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteAudio = async (audioId: number) => {
        try {
            await audiosApi.delete(audioId);
            runInAction(() => {
                this.AudioMap.delete(audioId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
