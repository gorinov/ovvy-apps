import { BaseApi } from './base.api';
import { UserLoginResponse } from '../../model/api/user/login';
import { UserCreateResponse } from '../../model/api/user/create';
import { UserValidateResponse } from '../../model/api/user/validate';
import { User } from '../../model/dto/user';
import { UserUpdateResponse } from '../../model/api/user/update';

export class UserApi extends BaseApi {
    public static async signIn(email, password): Promise<UserLoginResponse> {
        const response = await this.instance.post('/api/user/', {
            action: 'login',
            params: {
                email,
                password,
            },
        });

        let token: string = response.data.data?.token;
        if (!!token) {
            BaseApi.setToken(token);
        }

        return response.data;
    }

    public static async create(name, email, password): Promise<UserCreateResponse> {
        const response = await this.instance.post('/api/user/', {
            action: 'create',
            params: {
                name,
                email,
                password,
            },
        });

        return response.data;
    }

    public static async update(user: User): Promise<UserUpdateResponse> {
        const response = await this.instance.post('/api/user/', {
            action: 'update',
            params: {
                ...user,
            },
        });

        let token: string = response.data?.data?.token;
        if (!!token) {
            BaseApi.setToken(token);
        }

        return response.data;
    }

    public static async changePassword(oldPassword, newPassword): Promise<UserUpdateResponse> {
        const response = await this.instance.post('/api/user/', {
            action: 'changePassword',
            params: {
                oldPassword,
                newPassword,
            },
        });

        return response.data;
    }

    public static async reset(email): Promise<UserValidateResponse> {
        const response = await this.instance.post('/api/user/', {
            action: 'reset',
            params: {
                email,
            },
        });

        return response.data;
    }

    public static async approveRegistration(name, password, hash): Promise<UserValidateResponse> {
        const response = await this.instance.post('/api/user/', {
            action: 'approveRegistration',
            params: {
                name,
                password,
                hash,
            },
        });

        let token: string = response.data?.data?.token;
        if (!!token) {
            BaseApi.setToken(token);
        }

        return response.data;
    }

    public static async approvePassword(password, hash): Promise<UserValidateResponse> {
        const response = await this.instance.post('/api/user/', {
            action: 'approvePassword',
            params: {
                password,
                hash,
            },
        });

        let token: string = response.data?.data?.token;
        if (!!token) {
            BaseApi.setToken(token);
        }

        return response.data;
    }

    public static async approveAccount(hash): Promise<UserValidateResponse> {
        const response = await this.instance.post('/api/user/', {
            action: 'approveAccount',
            params: {
                hash,
            },
        });

        let token: string = response.data?.data?.token;
        if (!!token) {
            BaseApi.setToken(token);
        }

        return response.data;
    }

    public static async validate(): Promise<UserValidateResponse> {
        const response = await this.instance.post('/api/user/', {
            action: 'validate',
        });

        return response.data;
    }
}
