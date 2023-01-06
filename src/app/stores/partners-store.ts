import Partner from "@models/partners/partners.model";
import { makeAutoObservable, runInAction } from "mobx";
import partnersApi from "@api/partners.api";

export default class PartnersStore {
    public PartnerMap = new Map<number, Partner>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (partners: Partner[]) => {
        partners.forEach(this.setItem);
    }

    private setItem = (partner: Partner) => {
        this.PartnerMap.set(partner.id, partner);
    }

    public getPartnerArray = () => {
        return Array.from(this.PartnerMap.values());
    }

    public fetchPartner = async (id: number) => {
        try {
            const partner = await partnersApi.getById(id);
            this.setItem(partner);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public fetchPartners = async () => {
        try {
            const partners = await partnersApi.getAll();
            this.setInternalMap(partners);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public createPartner = async (partner: Partner) => {
        try {
            await partnersApi.create(partner);
            this.setItem(partner);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public updatePartner = async (partner: Partner) => {
        try {
            await partnersApi.update(partner);
            runInAction(() => {
                const updatedPartner = {
                    ...this.PartnerMap.get(partner.id),
                    ...partner
                };
                this.setItem(updatedPartner as Partner);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public deletePartner = async (partnerId: number) => {
        try {
            await partnersApi.delete(partnerId);
            runInAction(() => {
                this.PartnerMap.delete(partnerId);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }
}