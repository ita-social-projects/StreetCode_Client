import { makeAutoObservable, runInAction } from 'mobx';
import ImagesApi from '@api/media/images.api';
import Image, { ImageCreate } from '@models/media/image.model';
import { useQueries } from '@tanstack/react-query';

export default class ImageStore {
    public ImageMap = new Map<number, Image>();

    public constructor() {
        makeAutoObservable(this);
    }

    public addImage = (image: Image) => {
        this.setItem(image);
    };

    private setInternalMap = (images: Image[]) => {
        this.ImageMap.clear();
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
        await ImagesApi.getById(imageId)
            .then((im) => {
                image = im;
            })
            .catch((error) => {});
        return image;
    }

    public getImage = (id: number) => this.ImageMap.get(id);

    public fetchImage = async (id: number) => {
        try {
            const image = await ImagesApi.getById(id);
            this.setItem(image);
        } catch (error: unknown) { /* empty */ }
    };

    public fetchImages = (array: { imageId: number }[]) => {
        useQueries({
            queries: array
                ? array.map(({ imageId }) => ({
                    queryKey: ['image', imageId],
                    queryFn: () => ImagesApi.getById(imageId).then((image) => {
                        this.setItem(image);
                        return image;
                    }),
                }))
                : [],
        });
    };

    public fetchImageByStreetcodeId = async (streetcodeId: number) => {
        try {
            const image = await ImagesApi.getByStreetcodeId(streetcodeId);
            this.setInternalMap(image);
        } catch (error: unknown) { /* empty */ }
    };

    public createImage = async (image: ImageCreate) => {
        try {
            await ImagesApi.create(image).then((resp) => {
                this.setItem(resp);
            });
        } catch (error: unknown) { /* empty */ }
    };

    public updateImage = async (image: Image) => {
        try {
            await ImagesApi.update(image);
            runInAction(() => {
                const updatedImage = {
                    ...this.ImageMap.get(image.id),
                    ...image,
                };
                this.setItem(updatedImage as Image);
            });
        } catch (error: unknown) { /* empty */ }
    };

    public deleteImage = async (imageId: number) => {
        try {
            await ImagesApi.delete(imageId);
            runInAction(() => {
                this.ImageMap.delete(imageId);
            });
        } catch (error: unknown) { /* empty */ }
    };
}
