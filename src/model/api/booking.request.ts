import { BaseResponse } from './base.response';

export interface BookingRequestInfo {
    id: number;
    createdDate: number;
    email: string;
    guests: number;
    wish: string;
    phone: string;
    date: number;
    name: string;
    time: string;
}

export interface BookingRequestsResponse extends BaseResponse {
    data: {
        requests: BookingRequestInfo[];
        count: number;
    };
}
