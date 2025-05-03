import { PaginationInfo } from "@/models/pagination/pagination.model";
import { makeAutoObservable, runInAction } from "mobx";
import JobApi from "../api/job/Job.api";

export default class JobsStore {
    public JobsMap = new Map<number, Job>();

    private defaultPageSize = 10;

    private paginationInfo: PaginationInfo = {
        PageSize: this.defaultPageSize,
        TotalPages: 1,
        TotalItems: 1,
        CurrentPage: 1,
    };

    public constructor() {
        makeAutoObservable(this);
    }

    public setInternalMap(jobs: Job[]) {
        this.JobsMap.clear();
        jobs.forEach(this.setItem);
    }

    public setItem = (job: Job) => {
        this.JobsMap.set(job.id, job);
    };

    public setCurrentPage(currPage: number) {
        this.paginationInfo.CurrentPage = currPage;
    }

    public set PaginationInfo(paginationInfo: PaginationInfo) {
        this.paginationInfo = paginationInfo;
    }

    public get PaginationInfo(): PaginationInfo {
        return this.paginationInfo;
    }

    get getJobsArray() {
        return Array.from(this.JobsMap.values());
    }

    public getAll = async (title = '', pageSize?: number) => {
        try {
            const currentPage = this.PaginationInfo.CurrentPage;
            const response = await JobApi.getAll(
                currentPage,
                pageSize ?? this.paginationInfo.PageSize,
                title,
            );

            if (response && response.totalAmount !== undefined && response.jobs) {
                runInAction(() => {
                    this.PaginationInfo.TotalItems = response.totalAmount;
                    this.PaginationInfo.TotalPages = Math.ceil(
                        response.totalAmount / (pageSize ?? this.paginationInfo.PageSize),
                    );
                    this.setInternalMap(response.jobs);
                });
            } else {
                console.warn('Невірна відповідь від API або відсутні теги.');
            }
        } catch (error) {
            console.error('Помилка при отриманні тегів:', error);
        }
    };
}
