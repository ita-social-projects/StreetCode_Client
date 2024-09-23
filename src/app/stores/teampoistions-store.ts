import { makeAutoObservable, runInAction } from 'mobx';
import Position, {PositionCreate, StreetcodePosition} from '@models/additional-content/teampositions.model';
import teampositionsApi from '@api/team/teampositions.api';
import { PaginationInfo } from '@/models/pagination/pagination.model';

export default class TeamPositionsStore {
    public AllPositionsMap = new Map<number, Position>();

    public PositionsMap = new Map<number, Position>();

    public PositionsCatalogMap = new Map<number, Position>();

    public PositionsToDeleteArray: StreetcodePosition[] = [];

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

    private set setInternalAllPositions(positions: Position[]) {
        this.AllPositionsMap.clear();
        positions.forEach(this.setAllItem);
    }

    private set setInternalMap(positions: Position[]) {
        this.PositionsMap.clear();
        positions.forEach(this.setItem);
    }

    private set setInternalCatalog(positions: Position[]) {
        positions.forEach(this.setCatalogItem);
    }

    private setAllItem = (positions: Position) => {
        this.AllPositionsMap.set(positions.id, positions);
    };

    private setItem = (positions: Position) => {
        this.PositionsMap.set(positions.id, positions);
    };

    private setCatalogItem = (positions: Position) => {
        this.PositionsCatalogMap.set(positions.id, positions);
    };

    public setItemToDelete = (positions: StreetcodePosition) => {
        this.PositionsToDeleteArray.push(positions);
    };

    public deleteItemFromArrayToDelete = (position: string) => {
        this.PositionsToDeleteArray = this.PositionsToDeleteArray.filter((t) => t.title !== position);
    };

    get getPositionsToDeleteArray() {
        return this.PositionsToDeleteArray;
    }

    get getAllPositionsArray() {
        return Array.from(this.AllPositionsMap.values());
    }

    get getPositionsArray() {
        return Array.from(this.PositionsMap.values());
    }

    get getPositionsCatalogArray() {
        return Array.from(this.PositionsCatalogMap.values());
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

    public fetchAllPositions = async () => {
        // try {
        //     this.setInternalAllPositions = await teampositionsApi.getAll();
        // } catch (error: unknown) { /* empty */ }
    };

    public fetchPositions = async (pageSize?: number) => {
        await teampositionsApi.getAll(this.PaginationInfo.CurrentPage, pageSize ?? this.paginationInfo.PageSize)
            .then((resp) => {
                this.PaginationInfo.TotalItems = resp.totalAmount;
                this.setInternalMap = resp.positions;
            })
            .catch((error) => console.error(error));
    };

    public fetchAllPositionsWithMembers = async () => {
        try {
            this.setInternalMap = await teampositionsApi.getAllWithTeamMembers();
        } catch (error: unknown) { /* empty */ }
    };

    public fetchPositionsCatalogWithMembers = async () => {
        try {
            this.setInternalCatalog = await teampositionsApi.getAllWithTeamMembers();
        } catch (error: unknown) { /* empty */ }
    };

    public createPosition = async (position: PositionCreate) => {
        try {
            const newpositions: Position = await teampositionsApi.create(position);
            this.setItem(newpositions);
        } catch (error: unknown) { /* empty */ }
    };

    public updatePosition = async (position: Position) => {
        try {
            await teampositionsApi.update(position);
            runInAction(() => {
                const updatePosition = {
                    ...this.PositionsMap.get(position.id),
                    ...position,
                };
                this.setItem(updatePosition as Position);
            });
        } catch (error: unknown) { /* empty */ }
    };

    public deletePosition = async (positionId: number) => {
        try {
            await teampositionsApi.delete(positionId);
            runInAction(() => {
                this.PositionsMap.delete(positionId);
            });
        } catch (error: unknown) { /* empty */ }
    };
}
