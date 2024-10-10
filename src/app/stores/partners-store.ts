import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import partnersApi from '@api/partners/partners.api';
import Partner, { PartnerCreateUpdate, PartnerShort } from '@models/partners/partners.model';

import ImagesApi from '../api/media/images.api';

export default class PartnersStore {
    public PartnerMap = new Map<number, Partner>();

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

    get getPartnerArray() {
        return Array.from(this.PartnerMap.values());
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

    public fetchPartnersByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalMap(await partnersApi.getByStreetcodeId(streetcodeId));
        } catch (error: unknown) {}
    };

    public fetchPartnersAll = async () => {
        try {
            this.setInternalMap(await partnersApi.getAll());
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
