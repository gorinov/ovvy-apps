import {BookingSettingsInfo} from "../model/api/booking.settings";
import {BookingSettings} from "../model/dto/booking.settings";
import {IWorkingTimeInfo} from "../model/api/company";
import _ from 'lodash'

export class BookingSettingsBuilder {
    static build(bookingSettingInfo: BookingSettingsInfo): BookingSettings {
        let bookingSetting: BookingSettings = new BookingSettings();

        if (!bookingSettingInfo) {
            return bookingSetting;
        }

        if (!_.isUndefined(bookingSettingInfo.id)) {
            bookingSetting.id = bookingSettingInfo.id;
        }
        if (!_.isUndefined(bookingSettingInfo.telegramId)) {
            bookingSetting.telegramId = bookingSettingInfo.telegramId;
        }
        if (!_.isUndefined(bookingSettingInfo.telegramUsername)) {
            bookingSetting.telegramUsername = bookingSettingInfo.telegramUsername;
        }

        if (!_.isUndefined(bookingSettingInfo.active)) {
            bookingSetting.active = bookingSettingInfo.active;
        }
        if (!_.isUndefined(bookingSettingInfo.providerId)) {
            bookingSetting.providerId = bookingSettingInfo.providerId;
        }
        if (!_.isUndefined(bookingSettingInfo.date)) {
            bookingSetting.date =  new Date(Date.parse(bookingSettingInfo.date));
        }
        if (!_.isUndefined(bookingSettingInfo.lastBookingMotivatorEnabled)) {
            bookingSetting.lastBookingMotivatorEnabled = bookingSettingInfo.lastBookingMotivatorEnabled;
        }
        if (!_.isUndefined(bookingSettingInfo.personsCountDefault)) {
            bookingSetting.personsCountDefault = bookingSettingInfo.personsCountDefault;
        }
        if (!_.isUndefined(bookingSettingInfo.bookingTimeDefaultModeEnabled)) {
            bookingSetting.bookingTimeDefaultModeEnabled = bookingSettingInfo.bookingTimeDefaultModeEnabled;
        }
        if (!_.isUndefined(bookingSettingInfo.email)) {
            bookingSetting.email = bookingSettingInfo.email;
        }
        bookingSetting.title = bookingSettingInfo.title;

        if (bookingSetting.lastBookingMotivatorEnabled && bookingSettingInfo.lastBookingTime) {
            bookingSetting.lastBookingTime = new Date(Date.parse(bookingSettingInfo.lastBookingTime));
        }

        this.buildWorkingTime(bookingSetting, bookingSettingInfo.bookingTime);

        return bookingSetting;
    }

    static buildWorkingTime(bookingSetting: BookingSettings, workingTimeInfo: IWorkingTimeInfo) {
        for (let dayCode in workingTimeInfo) {
            let workingTime = workingTimeInfo[dayCode];

            if (workingTime) {
                let workingTimeParts = workingTime.split('-');

                if (workingTimeParts.length === 2) {
                    bookingSetting.bookingTime[dayCode].open = workingTimeParts[0].trim();
                    bookingSetting.bookingTime[dayCode].close = workingTimeParts[1].trim();
                    bookingSetting.bookingTime[dayCode].isWorking = true;
                } else {
                    bookingSetting.bookingTime[dayCode].isWorking = false;
                }
            } else {
                bookingSetting.bookingTime[dayCode].open = null;
                bookingSetting.bookingTime[dayCode].close = null;
                bookingSetting.bookingTime[dayCode].isWorking = false;
            }
        }
    }
}
