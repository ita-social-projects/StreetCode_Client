import { makeAutoObservable, runInAction } from 'mobx';
import usersApi from '@api/users/users.api';
import AuthService from '@app/common/services/auth-service/AuthService';
import User, { UpdateUser } from '@models/user/user.model';

export default class UserStore {
    public user : null | User = null;

    constructor() {
        makeAutoObservable(this);
    }

    public setUser(user: User | null) {
        this.user = user;
    }

    public async fetchCurrentUser() {
        const fetchedUser = await usersApi.getByUserName();
        runInAction(() => {
            this.setUser(fetchedUser);
        });
    }

    public async updateUser(updatedUser: UpdateUser) {
        const updatedData = await usersApi.update(updatedUser);
        runInAction(() => {
            this.setUser(updatedData);
        });
    }

    public async deleteUser(email: string) {
        await usersApi.delete(email);
        runInAction(() => {
            this.setUser(null);
        });
        AuthService.logout();
    }
}
