import axios from 'axios';

export class Api {
    static baseUrl = 'https://ovvy.ru';

    public static getToken() {
        return localStorage.getItem('token');
    }

    public static async getFormCompanyData(): Promise<any> {
        const response = await instance.get('/api/', {
            params: {
                action: 'getFormCompanyData',
            },
        });

        let data = response.data;

        if (data && data.errors) {
            return Promise.reject(data.errors);
        }

        return data.data;
    }
}

const instance = axios.create({
    baseURL: Api.baseUrl,
    responseType: 'json',
});
