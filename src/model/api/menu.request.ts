import { BaseResponse } from './base.response';
import { KeyValuePair } from 'model/enum/core';

export interface MenuRequestInfo {
    customer: KeyValuePair;
    data: KeyValuePair[];
    id: number;
    createdDate: number;
}

export interface MenuRequestsResponse extends BaseResponse {
    data: MenuRequestInfo[];
}
