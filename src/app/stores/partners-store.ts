import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import partnersApi from '@api/partners/partners.api';
import Partner, { PartnerCreateUpdate, PartnerShort } from '@models/partners/partners.model';

export default class PartnersStore {
    public PartnerMap = new Map<number, Partner>();

    public constructor() {
        makeAutoObservable(this, {
            PartnerMap: observable,
            fetchPartnersByStreetcodeId: action,
            fetchPartnersAll: action,
            getAll: action,
            createPartner: action,
            updatePartner: action,
            deletePartner: action,
            setInternalMap: action,
            setItem: action,
        });
    }

    public setInternalMap(partners: Partner[]) {
        partners.forEach(this.setItem);
    }

    public setItem = (partner: Partner) => {
        this.PartnerMap.set(partner.id, partner);
    };

    public static async getAllPartnerShort():Promise<PartnerShort[]> {
        try {
            return await partnersApi.getAllShort();
        } catch (error: unknown) {
            console.log(error);
        }
        return [];
    }

    get getPartnerArray() {
        return Array.from(this.PartnerMap.values());
    }

    public getAll = async () => {
        try {
            this.setInternalMap(await partnersApi.getAll());
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchPartnersByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalMap(await partnersApi.getByStreetcodeId(streetcodeId));
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchPartnersAll = async () => {
        try {
            this.setInternalMap(await partnersApi.getAll());
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createPartner = async (partner: PartnerCreateUpdate) => {
        try {
            const newPartner = await partnersApi.create(partner);
            this.setItem(newPartner);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updatePartner = async (partner: PartnerCreateUpdate) => {
        try {
            const updated = await partnersApi.update(partner);
            this.setItem(updated);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deletePartner = async (partnerId: number) => {
        try {
            await partnersApi.delete(partnerId);
            runInAction(() => {
                this.PartnerMap.delete(partnerId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
