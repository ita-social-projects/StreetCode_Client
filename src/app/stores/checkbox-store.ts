import { makeAutoObservable } from 'mobx';

type CheckBoxState = {
    isActive: boolean;
};

const DisabledCheckBoxState: CheckBoxState = {
    isActive: false,
};

const ActiveCheckBoxState: CheckBoxState = {
    isActive: true,
};

interface CheckBoxList {
    streets: CheckBoxState;
    streetcodes: CheckBoxState;
    routes: CheckBoxState;
}

export default class CheckBoxStore {
    public checkBoxesState: CheckBoxList = {
        streets: ActiveCheckBoxState,
        streetcodes: DisabledCheckBoxState,
        routes: DisabledCheckBoxState,
    };

    public constructor() {
        makeAutoObservable(this);
    }

    public setCheckBox = (checkBoxName: keyof CheckBoxList, activated?: boolean) => {
        this.checkBoxesState[checkBoxName] = {
            isActive: activated ?? !this.checkBoxesState[checkBoxName].isActive,
        };
    };
}