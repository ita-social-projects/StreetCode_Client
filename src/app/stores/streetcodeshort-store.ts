/* eslint-disable no-restricted-imports */
import { action, makeAutoObservable, observable } from 'mobx';

import { StreetcodeShort } from '../../models/streetcode/streetcode-types.model';
import StreetcodesApi from '../api/streetcode/streetcodes.api';

export default class StreetcodeShortStore {
    public streetcodes = new Array<StreetcodeShort>();

    public constructor() {
        makeAutoObservable(
            this,
            {
                fetchStreetcodesAll: action,
                addItemToArray: action,
                streetcodes: observable,
            },
        );
    }

    public fetchStreetcodesAll = async () => {
        StreetcodesApi.getAllShort()
            .then((value) => {
                this.streetcodes = value.map((s) => ({ id: s.id, title: s.title, index: s.index }));
            }).catch((error) => {
                console.log(error);
            });
    };

    public addItemToArray = (item: StreetcodeShort) => {
        this.streetcodes.push(item);
    };
}
