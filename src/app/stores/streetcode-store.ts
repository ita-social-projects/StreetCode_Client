import { makeAutoObservable, runInAction } from 'mobx';
import streetcodesApi from '@api/streetcode/streetcodes.api';
import Streetcode, { EventStreetcode, PersonStreetcode } from '@models/streetcode/streetcode-types.model';

export default class StreetcodeStore {
    public StreetcodeMap = new Map<number, Streetcode>();

    public EventMap : EventStreetcode [] = [];

    public PersonMap : PersonStreetcode [] = [];

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (streetcodes: Streetcode[]) => {
        streetcodes.forEach(this.setItem);
    };

    private setItem = (streetcode: Streetcode) => {
        this.StreetcodeMap.set(streetcode.id, streetcode);
    };

    public getStreetcodeArray = () => Array.from(this.StreetcodeMap.values());

    public fetchStreetcode = async (id: number) => {
        try {
            const streetcode = await streetcodesApi.getById(id);
            this.setItem(streetcode);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchStreetcodes = async () => {
        try {
            const Streetcodes = await streetcodesApi.getAll();
            this.setInternalMap(Streetcodes);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchEvents = async () => {
        try {
            const events = await streetcodesApi.getEvents();
            this.EventMap = events;
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchPersons = async () => {
        try {
            const persons = await streetcodesApi.getPersons();
            this.PersonMap = persons;
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchStreetcodeByTagId = async (tagId: number) => {
        try {
            const streetcode = await streetcodesApi.getByTagId(tagId);
            this.setItem(streetcode);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchStreetcodeByName = async (name: string) => {
        try {
            const streetcode = await streetcodesApi.getByName(name);
            this.setItem(streetcode);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchStreetcodeByIndex = async (index: string) => {
        try {
            const streetcode = await streetcodesApi.getByIndex(index);
            this.setItem(streetcode);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createStreetcode = async (streetcode: Streetcode) => {
        try {
            await streetcodesApi.create(streetcode);
            this.setItem(streetcode);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateStreetcode = async (streetcode: Streetcode) => {
        try {
            await streetcodesApi.update(streetcode);
            runInAction(() => {
                const updatedStreetcode = {
                    ...this.StreetcodeMap.get(streetcode.id),
                    ...streetcode,
                };
                this.setItem(updatedStreetcode as Streetcode);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteStreetcode = async (streetcodeId: number) => {
        try {
            await streetcodesApi.delete(streetcodeId);
            runInAction(() => {
                this.StreetcodeMap.delete(streetcodeId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
