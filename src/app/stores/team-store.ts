import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import teamApi from '@api/team/team.api';
import TeamMember, { TeamCreateUpdate } from '@models/team/team.model';

import ImagesApi from '../api/media/images.api';

export default class TeamStore {
    public TeamMap = new Map<number, TeamMember>();

    public constructor() {
        makeAutoObservable(this, {
            TeamMap: observable,
            fetchTeamAll: action,
            getAll: action,
            getById: action,
            setInternalMap: action,
            setItem: action,
        });
    }

    public setInternalMap(team: TeamMember[]) {
        team.forEach(this.setItem);
    }

    public setItem = (team: TeamMember) => {
        this.TeamMap.set(team.id, team);
    };

    get getTeamArray() {
        return Array.from(this.TeamMap.values());
    }

    public getAll = async () => {
        try {
            this.setInternalMap(await teamApi.getAll());
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public getById = async (teamId: number) => {
        try {
            this.setItem(await teamApi.getById(teamId));
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchTeamAll = async () => {
        try {
            this.setInternalMap(await teamApi.getAll());
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createTeam = async (team: TeamCreateUpdate) => {
        try {
            return await teamApi.create(team)
                .then((created) => {
                    ImagesApi.getById(created.imageId).then((logo) => ({ ...created, image: logo }))
                        .then((t) => this.setItem(t));
                });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateTeam = async (team: TeamCreateUpdate) => {
        try {
            await teamApi.update(team).then((updated) => {
                ImagesApi.getById(updated.imageId).then((logo) => ({ ...updated, image: logo }))
                    .then((t) => this.setItem(t));
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteTeam = async (teamId: number) => {
        try {
            await teamApi.delete(teamId);
            runInAction(() => {
                this.TeamMap.delete(teamId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
