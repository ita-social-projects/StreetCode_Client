import { action, makeAutoObservable, observable } from 'mobx';

import { Positions } from '../../models/team/team.model';
import PositionsApi from '../api/team/teampositions.api';

export default class PositionsStore {
    public positions = new Array<Positions>();

    public constructor() {
        makeAutoObservable(this, {
            fetchStreetcodesAll: action,
            addItemToArray: action,
        });
    }

    public static async getAll(): Promise<Positions[]> {
        try {
            return await PositionsApi.getAll().then((resp) => resp.positions);
        } catch (error: unknown) {
            console.error(error);
        }
        return [];
    }

    public fetchStreetcodesAll = async () => {
        PositionsApi.getAll()
            .then((value) => {
                this.positions = value.positions.map((s) => ({ id: s.id, position: s.position }));
            }).catch((error) => {
                console.error(error);
            });
    };

    public addItemToArray = (item: Positions) => {
        this.positions.push(item);
    };
}
