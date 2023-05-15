/* eslint-disable no-underscore-dangle */
import { makeAutoObservable } from 'mobx';

export default class ImageLoaderStore {
    public loadedImagesCount = 0;

    public totalImagesToLoad = 0;

    public constructor() {
        makeAutoObservable(this);
    }

    set setTotalImagesToLoad(count: number) {
        this.totalImagesToLoad = count;
    }

    public handleImageLoad = () => {
        this.loadedImagesCount += 1;
    };

    get imagesLoadedPercentage() {
        return (this.loadedImagesCount / this.totalImagesToLoad) * 100;
    }
}
