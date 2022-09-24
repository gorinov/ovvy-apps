import {DateUtil, IWorkingTime} from "../../utils/date";

export class BookingSettings {
    id: number;
    active: boolean = false;
    title: string;
    email: string = '';
    personsCountDefault: number = 2;
    date: Date;
    providerId: number;
    telegramId: number[] = [];
    telegramUsername: string[] = [];
    bookingTime: IWorkingTime = DateUtil.generateTime();
    lastBookingTime?: Date;
    lastBookingMotivatorEnabled: boolean = false;
    bookingTimeDefaultModeEnabled: boolean = true;
}