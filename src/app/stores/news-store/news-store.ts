import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import NewsApi from '@api/news/news.api';
import News from '@models/news/news.model';
import { QueryClient, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { PaginationInfo } from '@/models/pagination/pagination.model';

export default class NewsStore {
    public NewsMap = new Map<number, News>();

    public errorNewsId = -1;

    private currentNewsId = this.errorNewsId;

    private defaultPageSize = 10;

    private paginationInfo: PaginationInfo = {
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
            addNews: action,
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
        news.forEach(this.addNews);

        // as date is saved in UTC+0, add local offset to actualize date

        news.forEach((n) => {
            // eslint-disable-next-line no-param-reassign
            n.creationDate = dayjs(n.creationDate).subtract(localOffset, 'hours');
        });
    }

    public set CurrentNewsId(id: number) {
        this.currentNewsId = id;
    }

    public get CurrentNewsId(): number {
        return this.currentNewsId;
    }

    public addNews = (news: News) => {
        this.NewsMap.set(news.id, news);
    };

    public get NewsArray() {
        return Array.from(this.NewsMap.values());
    }

    public set PaginationInfo(paginationInfo: PaginationInfo) {
        this.paginationInfo = paginationInfo;
    }

    public get PaginationInfo(): PaginationInfo {
        return this.paginationInfo;
    }

    private resetQueries(keys: string[]) {
        this.queryClient?.invalidateQueries({ queryKey: keys });
    }

    public getByUrl = async (url: string) => {
        await NewsApi.getByUrl(url)
            .then((news) => {
                this.CurrentNewsId = news.id;
            })
            .catch((error) => console.log(error));
    };

    public getAll = async (page: number, pageSize?: number) => {
        useQuery(
            {
                queryKey: ['sortedNews', page],
                queryFn: () => NewsApi.getAll(page, pageSize ?? this.defaultPageSize)
                    .then((response) => {
                        runInAction(() => {
                            this.setInternalMap(response.data);
                            this.PaginationInfo = response.paginationInfo;
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
