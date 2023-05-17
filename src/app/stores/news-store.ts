import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import newsApi from '@api/news/news.api';
import News from '@models/news/news.model';

export default class NewsStore {
    public NewsMap = new Map<number, News>();

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
        news.forEach(this.setItem);
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

    public createNews = async (news: News) => {
        try {
            await newsApi.create(news).then((created) => this.setItem(created));
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateNews = async (news: News) => {
        try {
            await newsApi.update(news).then((updated) => this.setItem(updated));
        } catch (error: unknown) {
            console.log(error);
        }
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
