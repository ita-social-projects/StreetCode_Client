import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import teamApi from '@api/team/team.api';
import TeamMember, { TeamCreateUpdate } from '@models/team/team.model';

import ImagesApi from '../api/media/images.api';
import { PaginationInfo } from '@/models/pagination/pagination.model';

export default class TeamStore {
    public TeamMap = new Map<number, TeamMember>();

    private defaultPageSize = 10;

    private paginationInfo: PaginationInfo = {
        PageSize: this.defaultPageSize,
        TotalPages: 1,
        TotalItems: 1,
        CurrentPage: 1,
    };

    public constructor() {
        makeAutoObservable(this, {
            TeamMap: observable,
            getAll: action,
            getById: action,
            setInternalMap: action,
            setItem: action,
        });
    }

    public setInternalMap(team: TeamMember[]) {
        this.TeamMap.clear();
        team.forEach(this.setItem);
    }

    public setItem = (team: TeamMember) => {
        this.TeamMap.set(team.id, team);
    };

    get getTeamArray() {
        return Array.from(this.TeamMap.values());
    }

    public setCurrentPage(currPage: number) {
        this.paginationInfo.CurrentPage = currPage;
    }

    public set PaginationInfo(paginationInfo: PaginationInfo) {
        this.paginationInfo = paginationInfo;
    }

    public get PaginationInfo(): PaginationInfo {
        return this.paginationInfo;
    }

    public getAll = async (title = '', isMain = false, pageSize?: number) => {
        try {
            const validPageSize = pageSize && typeof pageSize === 'number' && pageSize > 0
                ? pageSize
                : this.paginationInfo.PageSize;

            const response = await teamApi.getAll(
                this.PaginationInfo.CurrentPage,
                validPageSize,
                title,
                isMain,
            );

            if (response && response.totalAmount !== undefined && response.teamMembers) {
                runInAction(() => {
                    this.PaginationInfo.TotalItems = response.totalAmount;
                    this.PaginationInfo.TotalPages = Math.ceil(
                        response.totalAmount / validPageSize
                    );
                    this.setInternalMap(response.teamMembers);
                });
            } else {
                console.warn('Невірна відповідь від API або відсутні теги.');
            }
        } catch (error) {
            console.error('Помилка при отриманні тегів:', error);
        }
    };

    public getById = async (teamId: number) => {
        try {
            this.setItem(await teamApi.getById(teamId));
        } catch (error: unknown) {
            console.error(error);
        }
    };

    public createTeam = async (team: TeamCreateUpdate) => {
        await teamApi.create(team)
            .then((created) => {
                ImagesApi.getById(created.imageId).then((logo) => ({ ...created, image: logo }))
                    .then((t) => this.setItem(t));
            });
    };

    public updateTeam = async (team: TeamCreateUpdate) => {
        await teamApi.update(team).then((updated) => {
            ImagesApi.getById(updated.imageId).then((logo) => ({ ...updated, image: logo }))
                .then((t) => this.setItem(t));
        });
    };

    public deleteTeam = async (teamId: number) => {
        try {
            await teamApi.delete(teamId);
            runInAction(() => {
                this.TeamMap.delete(teamId);
            });
        } catch (error: unknown) {
            console.error(error);
        }
    };
}
