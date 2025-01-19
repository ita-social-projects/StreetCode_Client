import { action, makeObservable, observable, runInAction } from 'mobx';
import { redirect } from 'react-router-dom';
import usersApi from '@api/users/users.api';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import User, { UpdateUser } from '@models/user/user.model';

export default class UserStore {
    public user : null | User = null;

    constructor() {
        makeObservable(this, {
            user: observable,
            fetchCurrentUser: action,
            setUser: action,
            updateUser: action,
        });
    }

    public setUser(user: User | null) {
        this.user = user;
    }

    public async fetchCurrentUser() {
        try {
            const fetchedUser = await usersApi.getByUserName();
            runInAction(() => {
                this.setUser(fetchedUser);
            });
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    public async updateUser(updatedUser: UpdateUser) {
        try {
            const updatedData = await usersApi.update(updatedUser);
            runInAction(() => {
                this.setUser(updatedData);
            });
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    public async deleteUser(email: string) {
        try {
            await usersApi.delete(email);
            runInAction(() => {
                this.setUser(null);
            });
            redirect(FRONTEND_ROUTES.ADMIN.LOGIN);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
}
