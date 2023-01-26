import { makeAutoObservable, runInAction } from 'mobx';
import partnersApi from '@api/partners/partners.api';
import Partner from '@models/partners/partners.model';

export default class PartnersStore {
    public PartnerMap = new Map<number, Partner>();

    public constructor() {
        makeAutoObservable(this);
    }

    private set setInternalMap(partners: Partner[]) {
        partners.forEach(this.setItem);
    }

    private setItem = (partner: Partner) => {
        this.PartnerMap.set(partner.id, partner);
    };

    public get getPartnerArray() {
        return Array.from(this.PartnerMap.values());
    }

    public fetchPartner = async (id: number) => {
        try {
            const partner = await partnersApi.getById(id);
            this.setItem(partner);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchPartners = async () => {
        try {
            const partners = await partnersApi.getAll();
            this.setInternalMap = partners;
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchPartnersByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalMap = await partnersApi.getByStreetcodeId(streetcodeId);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createPartner = async (partner: Partner) => {
        try {
            await partnersApi.create(partner);
            this.setItem(partner);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updatePartner = async (partner: Partner) => {
        try {
            await partnersApi.update(partner);
            runInAction(() => {
                const updatedPartner = {
                    ...this.PartnerMap.get(partner.id),
                    ...partner,
                };
                this.setItem(updatedPartner as Partner);
            });
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
