import { PaginationInfo } from "@/models/pagination/pagination.model";
import { makeAutoObservable } from "mobx";
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

    public getAll = async (pageSize?: number) => {
        await JobApi.getAll(this.PaginationInfo.CurrentPage, pageSize ?? this.paginationInfo.PageSize)
            .then((resp) => {
                this.PaginationInfo.TotalItems = resp.totalAmount;
                this.setInternalMap(resp.jobs);
                console.log(resp)
            })
            .catch((error) => console.error(error));
    };

    // public createPartner = async (partner: PartnerCreateUpdate) => {
    //     const createdPartner = await partnersApi.create(partner);
    //     const logo = await ImagesApi.getById(createdPartner.logoId);
    //     const createdPartnerWithLogo = { ...createdPartner, logo } as Partner;
    //     this.setItem(createdPartnerWithLogo);
    //     return createdPartnerWithLogo;
    // };

    // public updatePartner = async (partner: PartnerCreateUpdate) => {
    //     await partnersApi.update(partner).then((created) => {
    //         ImagesApi.getById(created.logoId).then((logo):Partner => ({ ...created, logo }))
    //             .then((p) => this.setItem(p));
    //     });
    // };

    // public static deleteJob = async (partnerId: number) => {
    //     try {
    //         await partnersApi.delete(partnerId);
    //     } catch (error: unknown) {}
    // };
}
