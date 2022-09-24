import {IWorkingTimeInfo} from "./company";
import {BaseResponse} from "./base.response";

export interface BookingSettingsInfo {
    id: number;
    active: boolean;
    title: string;
    email: string;
    personsCountDefault: number;
    date: string;
    bookingTime: IWorkingTimeInfo;
    providerId: number;
    telegramId: number[];
    telegramUsername: string[];
    lastBookingTime?: string;
    lastBookingMotivatorEnabled: boolean;
    bookingTimeDefaultModeEnabled: boolean;
    message: string
}

export interface BookingSettingsResponse extends BaseResponse{
    data: BookingSettingsInfo;
}