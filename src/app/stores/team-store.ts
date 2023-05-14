import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import teamApi from '@api/team/team.api';
import TeamMember, { TeamCreateUpdate } from '@models/team/team.model';

export default class TeamStore {
    public TeamMap = new Map<number, TeamMember>();

    public constructor() {
        makeAutoObservable(this, {
            TeamMap: observable,
            fetchTeamAll: action,
            getAll: action,
            getById: action,
            createPartner: action,
            updatePartner: action,
            deletePartner: action,
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
            await teamApi.create(team).then((created) => this.setItem(created));
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateTeam = async (team: TeamCreateUpdate) => {
        try {
            await teamApi.update(team).then((updated) => this.setItem(updated));
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