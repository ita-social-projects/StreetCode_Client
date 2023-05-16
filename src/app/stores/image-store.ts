import { makeAutoObservable, runInAction } from 'mobx';
import imagesApi from '@api/media/images.api';
import Image, { ImageCreate } from '@models/media/image.model';

export default class ImageStore {
    public ImageMap = new Map<number, Image>();

    public constructor() {
        makeAutoObservable(this);
    }

    public addImage = (image: Image) => {
        this.setItem(image);
    };

    private setInternalMap = (images: Image[]) => {
        images.forEach(this.setItem);
    };

    private setItem = (image: Image) => {
        this.ImageMap.set(image.id, image);
    };

    get getImageArray() {
        return Array.from(this.ImageMap.values());
    }

    static async getImageById(imageId:number):Promise<Image | undefined> {
        let image:Image | undefined;
        await imagesApi.getById(imageId)
            .then((im) => {
                image = im;
            })
            .catch((error) => {});
        return image;
    }

    public getImage = (id: number) => this.ImageMap.get(id);

    public fetchImage = async (id: number) => {
        try {
            const image = await imagesApi.getById(id);
            this.setItem(image);
        } catch (error: unknown) {}
    };

    public fetchImageByStreetcodeId = async (streetcodeId: number) => {
        try {
            const image = await imagesApi.getByStreetcodeId(streetcodeId);
            this.setInternalMap(image);
        } catch (error: unknown) {}
    };

    public createImage = async (image: ImageCreate) => {
        try {
            await imagesApi.create(image).then((resp) => {
                this.setItem(resp);
            });
        } catch (error: unknown) {}
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
        } catch (error: unknown) {}
    };

    public deleteImage = async (imageId: number) => {
        try {
            await imagesApi.delete(imageId);
            runInAction(() => {
                this.ImageMap.delete(imageId);
            });
        } catch (error: unknown) {}
    };
}
