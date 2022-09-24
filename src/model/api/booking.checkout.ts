import {BaseResponse} from "./base.response";

export interface BookingConfirmInfo {
    number: string,
    message?: string
}

export interface BookingCheckOutResponse extends BaseResponse {
    data: BookingConfirmInfo
}