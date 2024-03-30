import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import NewsApi from '@api/news/news.api';
import News from '@models/news/news.model';
import { QueryClient, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { PaginationInfo } from '@/models/pagination/pagination.model';

export default class NewsStore {
    public NewsMap = new Map<number, News>();

    public errorNewsId = -1;

    public currentNews = this.errorNewsId;

    private defaultPageSize = 10;

    private PaginationInfo: PaginationInfo = {
        PageSize: this.defaultPageSize,
        TotalPages: 1,
        TotalItems: 1,
        CurrentPage: 1,
    };

    private queryClient: QueryClient | null = null;

    public constructor() {
        makeAutoObservable(this, {
            NewsMap: observable,
            getAll: action,
            createNews: action,
            deleteNews: action,
            setInternalMap: action,
            setItem: action,
            updateNews: action,
            setQueryClient: action,
        });
    }

    public setQueryClient(client: QueryClient) {
        this.queryClient = client;
    }

    public setInternalMap(news: News[]) {
        // Offset in hours
        const localOffset = new Date().getTimezoneOffset() / 60;
        this.NewsMap.clear();
        news.forEach(this.setItem);

        // as date is saved in UTC+0, add local offset to actualize date

        news.forEach((n) => {
            // eslint-disable-next-line no-param-reassign
            n.creationDate = dayjs(n.creationDate).subtract(localOffset, 'hours');
        });
    }

    public setPaginationInfo(paginationInfo: PaginationInfo) {
        this.PaginationInfo = {
            ...paginationInfo,
        };
    }

    public set setNews(news: News) {
        this.currentNews = news.id;
    }

    public get getNewsId() {
        return this.currentNews;
    }

    public setItem = (news: News) => {
        this.NewsMap.set(news.id, news);
    };

    get getNewsArray() {
        return Array.from(this.NewsMap.values());
    }

    get getPaginationInfo(): PaginationInfo {
        return {
            ...this.PaginationInfo,
        };
    }

    private resetQueries(keys: string[]) {
        this.queryClient?.invalidateQueries({ queryKey: keys });
    }

    public setCurrentNewsId = async (url: string) => {
        try {
            const news = await NewsApi.getByUrl(url);
            if (news !== null) {
                this.setNews = news;
                return news;
            }
        } catch (error) {
            console.log(error);
        }
    };

    public getAll = async (page: number, pageSize?: number) => {
        useQuery(
            {
                queryKey: ['sortedNews', page],
                queryFn: () => NewsApi.getAll(page, pageSize ?? this.defaultPageSize)
                    .then((response) => {
                        runInAction(() => {
                            this.setInternalMap(response.data);
                            this.setPaginationInfo(response.paginationInfo);
                        });
                        return response;
                    })
                    .catch((error) => {
                        console.log(error);
                    }),
            },
        );
    };

    public createNews = async (news: News) => {
        await NewsApi.create(news).then(() => this.resetQueries(['sortedNews']));
    };

    public updateNews = async (news: News) => {
        await NewsApi.update(news).then(() => this.resetQueries(['sortedNews']));
    };

    public deleteNews = async (newsId: number) => {
        try {
            await NewsApi.delete(newsId);
            runInAction(() => {
                this.resetQueries(['sortedNews']);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
