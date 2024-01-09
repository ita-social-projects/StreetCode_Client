import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import newsApi from '@api/news/news.api';
import News from '@models/news/news.model';
import dayjs from 'dayjs';

export default class NewsStore {
    public NewsMap = new Map<number, News>();

    public errorNewsId = -1;

    public currentNews = this.errorNewsId;

    public constructor() {
        makeAutoObservable(this, {
            NewsMap: observable,
            fetchNewsAll: action,
            getAll: action,
            createNews: action,
            deleteNews: action,
            setInternalMap: action,
            setItem: action,
            updateNews: action,
        });
    }

    public setInternalMap(news: News[]) {
        // Offset in hours
        const localOffset = new Date().getTimezoneOffset() / 60;
        this.NewsMap.clear();
        news.forEach(this.setItem);

        // as date is saved in UTC+0, add local offset to actualize date
        news.forEach((n) => n.creationDate = dayjs(n.creationDate).subtract(localOffset, 'hours'));
    }

    public set setNews(news: News) {
        this.currentNews = news.id;
    }

    public setCurrentNewsId = async (url: string) => {
        try {
            const news = await newsApi.getByUrl(url);
            if (news !== null) {
                this.setNews = news;
                return news;
            }
        } catch (error) {
            console.log(error);
        }
    };

    public get getNewsId() {
        return this.currentNews;
    }

    public setItem = (news: News) => {
        this.NewsMap.set(news.id, news);
    };

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

    public fetchNewsAll = async () => {
        try {
            this.setInternalMap(await newsApi.getAll());
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchNewsAllSortedByCreationDate = async () => {
        try {
            this.setInternalMap(await newsApi.getAllSortedNews());
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createNews = async (news: News) => {
        await newsApi.create(news).then((created) => this.setItem(created));
    };

    public updateNews = async (news: News) => {
        await newsApi.update(news).then((updated) => this.setItem(updated));
    };

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
