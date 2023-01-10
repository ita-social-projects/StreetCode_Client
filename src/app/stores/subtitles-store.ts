import Subtitle from "@models/additional-content/subtitles.model";
import {makeAutoObservable, runInAction} from "mobx";
import subtitlesApi from "@api/additional-content/subtitles.api";

export default class SubtitleStore {
    public subtitles = new Map<number, Subtitle>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setSubtitles = (subtitles: Subtitle []) => {
        this.subtitles = subtitles.reduce(function (map: Map<number, Subtitle>, obj) {
            map.set(obj.id, obj);
            return map;
        }, new Map<number, Subtitle>());
    }

    get getSubtitlesArray(){
        return Array.from(this.subtitles.values());
    }

    public getById = async (id: number) => {
        try {
            const subtitle = await subtitlesApi.getById(id);
            runInAction(() => {
                this.subtitles.set(id, subtitle)
            });
        } catch (err: any) {
            console.log(err);
        }

    }

    public getAll = async () => {
        try {
            const subtitles = await subtitlesApi.getAll();
            runInAction(() => {
                this.setSubtitles(subtitles)
            });
        } catch (err: any) {
            console.log(err);
        }
    }

    public getSubtitlesByStreetcodeId = async (streetcodeId: number) => {
        try {
            const subtitles = await subtitlesApi.getSubtitlesByStreetcodeId(streetcodeId);
            this.setSubtitles(subtitles);
        } catch (err: any) {
            console.log(err);
        }
    }

    public create = async (subtitle: Subtitle) => {
        try {
            await subtitlesApi.create(subtitle);
            runInAction(() => {
                this.subtitles.set(subtitle.id, subtitle);
            })
        } catch (err: any) {
            console.log(err);
        }
    }

    public update = async (subtitle: Subtitle) => {
        try {
            await subtitlesApi.update(subtitle);
            runInAction(() => {
                const subtitleId = subtitle.id;
                const updatedSubtitle = {...this.subtitles.get(subtitleId), ...subtitle} as Subtitle;
                this.subtitles.set(subtitleId, updatedSubtitle);

            })
        } catch (err: any) {
            console.log(err);
        }
    }

    public delete = async (subtitleId: number) => {
        try {
            await subtitlesApi.delete(subtitleId);
        } catch (err: any) {
            console.log(err);
        }

    }
}