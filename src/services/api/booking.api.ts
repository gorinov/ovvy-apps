import { BaseApi } from './base.api';
import { BookingSettings } from '../../model/dto/booking.settings';
import { BookingCheckOutResponse } from '../../model/api/booking.checkout';
import { BookingSettingsResponse } from '../../model/api/booking.settings';

export class BookingApi extends BaseApi {
    public static getRequests(): Promise<any> {
        return this.instance
            .get('/api/booking/', {
                params: {
                    action: 'getRequests',
                },
            })
            .then((response) => {
                return response.data;
            });
    }

    public static getSettings(providerId?: number): Promise<BookingSettingsResponse> {
        return this.instance
            .get('/api/booking/', {
                params: {
                    action: 'getSettings',
                    providerId: providerId,
                },
            })
            .then((response) => {
                let data = response.data;

                if (data && data.errors) {
                    return Promise.reject(data.errors);
                }

                return data;
            });
    }

    public static async checkOut(data): Promise<BookingCheckOutResponse> {
        const response = await this.instance.post('/api/booking/', {
            action: 'checkOut',
            data: data,
        });

        return response.data;
    }

    public static async saveSettings(settings: BookingSettings): Promise<BookingSettingsResponse> {
        const response = await this.instance.post('/api/booking/', {
            action: 'saveSettings',
            settings: settings,
        });

        return response.data;
    }

    public static async getTelegramChats(id: number): Promise<string> {
        const response = await this.instance.post('/api/booking/', {
            action: 'getTelegramChats',
            message: id,
        });

        return response.data?.data;
    }

    public static async addTelegramChat(data: any): Promise<string> {
        const response = await this.instance.post('/api/booking/', {
            action: 'addTelegramChat',
            data: data,
        });

        return response.data;
    }

    public static async removeTelegramChat(data: any): Promise<string> {
        const response = await this.instance.post('/api/booking/', {
            action: 'removeTelegramChat',
            data: data,
        });

        return response.data;
    }
}
