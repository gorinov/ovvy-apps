import { BaseApi } from './base.api';
import { OfferResponse } from 'model/api/offer';
import { BaseResponse } from 'model/api/base.response';
import { Offer } from 'model/dto/offer';

export class OfferApi extends BaseApi {
    public static async getByCredential(): Promise<OfferResponse> {
        const response = await this.instance.get('/api/offer/', {
            params: {
                action: 'getByCredential',
            },
        });

        return response.data;
    }

    public static async getByMenu(id: number): Promise<OfferResponse> {
        const response = await this.instance.get('/api/offer/', {
            params: {
                action: 'getByMenu',
                data: id,
            },
        });

        return response.data;
    }

    public static async save(offer: Offer): Promise<BaseResponse> {
        const response = await this.instance.post('/api/offer/', {
            action: 'save',
            params: offer,
        });

        return response.data;
    }

    public static async delete(offer: Offer): Promise<BaseResponse> {
        const response = await this.instance.post('/api/offer/', {
            action: 'delete',
            params: offer,
        });

        return response.data;
    }
}
