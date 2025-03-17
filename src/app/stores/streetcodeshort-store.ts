/* eslint-disable no-restricted-imports */
import { makeAutoObservable } from 'mobx';
import { PaginationInfo } from '@models/pagination/pagination.model';
import { StreetcodeShort } from '@models/streetcode/streetcode-types.model';

import StreetcodesApi from '../api/streetcode/streetcodes.api';

export default class StreetcodeShortStore {
    public StreetcodesShortMap = new Map<number, StreetcodeShort>();

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

    public setInternalMap(streetcodesShort: StreetcodeShort[]) {
        this.StreetcodesShortMap.clear();
        streetcodesShort.forEach(this.setItem);
    }

    public setItem = (streetcodesShort: StreetcodeShort) => {
        this.StreetcodesShortMap.set(streetcodesShort.id, streetcodesShort);
    };

    public setCurrentPage(currPage: number) {
        this.paginationInfo.CurrentPage = currPage;
    }

    public set PaginationInfo(paginationInfo: PaginationInfo) {
        this.paginationInfo = paginationInfo;
    }

    public get PaginationInfo(): PaginationInfo {
        return this.paginationInfo;
    }

    public fetchStreetcodesAll = async (pageSize?: number) => {
        StreetcodesApi.getAllShort(this.PaginationInfo.CurrentPage, pageSize ?? this.paginationInfo.PageSize)
            .then((response) => {
                this.paginationInfo.TotalItems = response.totalAmount;
                this.setInternalMap(response.streetcodesShort);
            })
            .catch((error) => console.error(error));
    };
}
