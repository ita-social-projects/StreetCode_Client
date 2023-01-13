import { makeAutoObservable, runInAction } from 'mobx';
import imagesApi from '@api/media/images.api';
import Image from '@models/media/image.model';

export default class ImageStore {
    public ImageMap = new Map<number, Image>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (images: Image[]) => {
        images.forEach(this.setItem);
    };

    private setItem = (image: Image) => {
        this.ImageMap.set(image.id, image);
    };

    public getImageArray = () => Array.from(this.ImageMap.values());

    public getImage = (id: number) => this.ImageMap.get(id);

    public fetchImage = async (id: number) => {
        try {
            const image = await imagesApi.getById(id);
            this.setItem(image);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchImages = async () => {
        try {
            const images = await imagesApi.getAll();
            this.setInternalMap(images);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createImage = async (image: Image) => {
        try {
            await imagesApi.create(image);
            this.setItem(image);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateImage = async (image: Image) => {
        try {
            await imagesApi.update(image);
            runInAction(() => {
                const updatedImage = {
                    ...this.ImageMap.get(image.id),
                    ...image,
                };
                this.setItem(updatedImage as Image);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteImage = async (imageId: number) => {
        try {
            await imagesApi.delete(imageId);
            runInAction(() => {
                this.ImageMap.delete(imageId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
