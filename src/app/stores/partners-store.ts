import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import partnersApi from '@api/partners/partners.api';
import Partner, { PartnerCreateUpdate, PartnerShort } from '@models/partners/partners.model';

import ImagesApi from '../api/media/images.api';
import { PaginationInfo } from '@/models/pagination/pagination.model';

export default class PartnersStore {
    public PartnerMap = new Map<number, Partner>();

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

    public setInternalMap(partners: Partner[]) {
        this.PartnerMap.clear();
        partners.forEach(this.setItem);
    }

    public setItem = (partner: Partner) => {
        this.PartnerMap.set(partner.id, partner);
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

    public static getAllPartners = async () => {
        try {
            return await partnersApi.getAll();
        } catch (error: unknown) {}
        return [];
    };

    public static async getAllPartnerShort():Promise<PartnerShort[]> {
        try {
            return await partnersApi.getAllShort();
        } catch (error: unknown) {}
        return [];
    }

    get getPartnerArray() {
        return Array.from(this.PartnerMap.values());
    }

    public getAll = async (pageSize?: number) => {
        await partnersApi.getAll(this.PaginationInfo.CurrentPage, pageSize ?? this.paginationInfo.PageSize)
            .then((resp) => {
                this.PaginationInfo.TotalItems = resp.totalAmount;
                this.setInternalMap(resp.partners);
            })
            .catch((error) => console.error(error));
    };

    public fetchPartnersByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalMap(await partnersApi.getByStreetcodeId(streetcodeId));
        } catch (error: unknown) {}
    };

    public createPartner = async (partner: PartnerCreateUpdate) => {
        const createdPartner = await partnersApi.create(partner);
        const logo = await ImagesApi.getById(createdPartner.logoId);
        const createdPartnerWithLogo = { ...createdPartner, logo } as Partner;
        this.setItem(createdPartnerWithLogo);
        return createdPartnerWithLogo;
    };

    public updatePartner = async (partner: PartnerCreateUpdate) => {
        await partnersApi.update(partner).then((created) => {
            ImagesApi.getById(created.logoId).then((logo):Partner => ({ ...created, logo }))
                .then((p) => this.setItem(p));
        });
    };

    public static deletePartner = async (partnerId: number) => {
        try {
            await partnersApi.delete(partnerId);
        } catch (error: unknown) {}
    };
}
