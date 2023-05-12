import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import partnersApi from '@api/partners/partners.api';
import newsApi from '@api/news/news.api';
import Partner, { PartnerCreateUpdate, PartnerShort } from '@models/partners/partners.model';
import News from '@models/news/news.model'
export default class NewsStore {
    // public PartnerMap = new Map<number, Partner>();
    public NewsMap = new Map<number, News>();

    public constructor() {
        makeAutoObservable(this, {
            NewsMap: observable,
            // fetchPartnersByStreetcodeId: action,
            fetchNewsAll: action,
            getAll: action,
            createNews: action,
            // updatePartner: action,
            deleteNews: action,
            setInternalMap: action,
            setItem: action,
        });
    }

    public setInternalMap(news: News[]) {
        news.forEach(this.setItem);
    }

    public setItem = (news: News) => {
        this.NewsMap.set(news.id, news);
    };

    // public static async getAllPartnerShort():Promise<PartnerShort[]> {
    //     try {
    //         return await partnersApi.getAllShort();
    //     } catch (error: unknown) {
    //         console.log(error);
    //     }
    //     return [];
    // }

    get getNewsArray() {
        return Array.from(this.NewsMap.values());
    }

    public getAll = async () => {
        try {
            this.setInternalMap(await newsApi.getAll());
        } catch (error: unknown) {
            console.log(error);
        }
    };

    // public fetchPartnersByStreetcodeId = async (streetcodeId: number) => {
    //     try {
    //         this.setInternalMap(await partnersApi.getByStreetcodeId(streetcodeId));
    //     } catch (error: unknown) {
    //         console.log(error);
    //     }
    // };

    public fetchNewsAll = async () => {
        try {
            this.setInternalMap(await newsApi.getAll());
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createNews = async (news: News) => {
        try {
            await newsApi.create(news).then((created) => this.setItem(created));
        } catch (error: unknown) {
            console.log(error);
        }
    };

    // public updatePartner = async (partner: PartnerCreateUpdate) => {
    //     try {
    //         await partnersApi.update(partner).then((updated) => this.setItem(updated));
    //     } catch (error: unknown) {
    //         console.log(error);
    //     }
    // };

    public deleteNews = async (newsId: number) => {
        try {
            await newsApi.delete(newsId);
            runInAction(() => {
                this.NewsMap.delete(newsId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
