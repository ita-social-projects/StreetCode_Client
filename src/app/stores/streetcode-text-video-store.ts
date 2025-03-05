/* eslint-disable no-restricted-imports */
import { makeAutoObservable } from 'mobx';
import VideosApi from '@api/media/videos.api';
import TextsApi from '@api/streetcode/text-content/texts.api';
import { Text } from '@models/streetcode/text-contents.model';

import Video from '@/models/media/video.model';

export default class TextVideoStore {
    public Text : Text | undefined;

    public Video : Video | undefined;

    public constructor() {
        makeAutoObservable(this);
    }

    public fetchStreetcodeText = async (id: number): Promise<Text> => {
        const text = await TextsApi.getByStreetcodeId(id);
        text.textContent = await TextsApi.updateParsed(text);
        this.Text = text;
        return text;
    };

    public fetchStreetcodeVideo = async (id: number) : Promise<Video> => {
        const video = await VideosApi.getByStreetcodeId(id);
        this.Video = video;
        return video;
    };
}
