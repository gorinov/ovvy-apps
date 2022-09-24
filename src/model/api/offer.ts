import { BaseResponse } from './base.response';

export interface OfferInfo {
    id: number;
    title: string;
    name: string;
    description: string;
    image: string;
    showInSite: boolean;
    showInMenu: boolean;
    imageId: string;
    sort?: number;
    createdDate: number;
}

export interface OfferResponse extends BaseResponse {
    data:
        | OfferInfo[]
        | {
              message: string;
          };
}
