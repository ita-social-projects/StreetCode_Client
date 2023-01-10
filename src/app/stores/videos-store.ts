import Video from "@models/media/video.model";
import { makeAutoObservable, runInAction } from "mobx";
import videosApi from "@api/media/videos.api";

export default class VideosStore {
    public VideoMap = new Map<number, Video>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (videos: Video[]) => {
        videos.forEach(this.setItem);
    }

    private setItem = (video: Video) => {
        this.VideoMap.set(video.id, video);
    }

    private setItemByStreetcodeId = (video: Video) => {
        this.VideoMap.set(video.streetcodeId, video);
    }

    public getVideoArray = () => {
        return Array.from(this.VideoMap.values());
    }

    public getVideoByStreetcodeId = async (streetcodeId: number) => {
        try {
            const video = await videosApi.getByStreetcodeId(streetcodeId);
            this.setItem(video);
        }
        catch (err: any) {
            console.log(err);
        }
    }

    public fetchVideo = async (id: number) => {
        try {
            const video = await videosApi.getById(id);
            this.setItem(video);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public fetchVideos = async () => {
        try {
            const videos = await videosApi.getAll();
            this.setInternalMap(videos);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public createVideo = async (video: Video) => {
        try {
            await videosApi.create(video);
            this.setItem(video);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public updateVideo = async (video: Video) => {
        try {
            await videosApi.update(video);
            runInAction(() => {
                const updatedVideo = {
                    ...this.VideoMap.get(video.id),
                    ...video
                };
                this.setItem(updatedVideo as Video);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public deleteVideo = async (VideoId: number) => {
        try {
            await videosApi.delete(VideoId);
            runInAction(() => {
                this.VideoMap.delete(VideoId);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }
}