import {Text} from "./text";
import {IWorkingDay} from "./date";
import {TimeOption} from "../model/booking";
import {BookingSettings} from "../model/dto/booking.settings";

export class BookingUtil {
    static lastBooking(date): string {
        if (!date) {
            return null
        }

        let diff = (+new Date() - +new Date(date)) / (1000);
        if (diff >= 86400 * 3) {
            return null
        }

        let diffText = "Последний раз столик бронировали";
        if (diff < 3600) { // 1 час
            let minutes = Math.floor(diff / 60);

            if (minutes === 0) {
                diffText += " только что";
            } else {
                diffText += " " + minutes + " " + Text.getNumEnding(minutes, ["минуту", "минуты", "минут"]) + " назад";
            }
        } else if (diff < 86400){ // 24 часа
            let hours = Math.floor(diff / 3600);
            diffText += " " + hours + " " + Text.getNumEnding(hours, ["час", "часа", "часов"]) + " назад";
        } else { // 3 дня
            let days = Math.floor(diff / (3600 * 24));
            diffText += " " + days + " " + Text.getNumEnding(days, ["день", "дня", "дней"]) + " назад";
        }

        return diffText;
    }

    static getTimeOptions(currentDateTime: Date, settings: BookingSettings): TimeOption[] {
        const currentDayName: string = currentDateTime.toLocaleString('en', {weekday: 'long'});
        const dayInfo: IWorkingDay = settings.bookingTime[currentDayName];

        if (!dayInfo.isWorking) {
            return [];
        }

        let endMode = currentDateTime.ovClone(),
            startMode = currentDateTime.ovClone(),
            arStartMode = dayInfo.open.split(":"),
            arEndMode = dayInfo.close.split(":"),
            bookingOpening = true;

        let date = new Date();
        let startHour = parseInt(arStartMode[0]);
        let endHour = parseInt(arEndMode[0]);

        startMode.setHours(startHour);
        startMode.setMinutes(parseInt(arStartMode[1]));

        // Если режим работы после 00:00, то переходим на след. день
        if (endHour <= startHour) {
            endMode.setDate(endMode.getDate() + 1);
        }

        endMode.setHours(endHour);
        endMode.setMinutes(parseInt(arEndMode[1]));
        endMode.setSeconds(0);

        if (settings.bookingTimeDefaultModeEnabled) {
            endMode.setMinutes(endMode.getMinutes() - 30); // чтобы режим строился не до конца рабочего дня
            // Если до открытия больше 30 минут, то разрешаем бронировать с открытия
            let differenceNowMin = (startMode.getTime() - date.getTime()) / 60000;
            if (differenceNowMin > 30) {
                bookingOpening = false;
                date.setHours(startMode.getHours());
                date.setMinutes(startMode.getMinutes());
            }
        }

        if (startHour === endHour) {
            endMode.setMinutes(endMode.getMinutes() - 30)
        }

        let options: TimeOption[] = [];
        while (startMode < endMode) {
            if (!bookingOpening) {
                startMode.setMinutes(startMode.getMinutes() + 30);
            }

            options.push(new TimeOption(startMode));

            bookingOpening = false;
        }

        return this.resolveVisibleOptions(options, currentDateTime);
    };

    static setSelectDate(options: TimeOption[], dateTime: Date): TimeOption[] {
        options.forEach(option => option.selected = option.dateTime === dateTime);

        return options;
    }

    static hasAvailableOption(options: TimeOption[], date: Date): boolean {
        const isToday: boolean = date.ovIsEqualDate(new Date());

        if (isToday) {
            return options.filter((option: TimeOption) => option.dateTime > date).length > 0;
        } else {
            return !!options.length;
        }
    };

    static resolveVisibleOptions(options: TimeOption[], currentDate: Date, selectedDateTime: Date = null, showAll: boolean = false): TimeOption[]  {
        const currentDateTime: Date = currentDate.ovClone();
        const isToday: boolean = currentDateTime.ovIsEqualDate(new Date());

        // Если выбранный день не сегодняшний, обнуляем левый предел
        if (!isToday || showAll) {
            currentDateTime.setHours(0);
            currentDateTime.setMinutes(0);
        }

        currentDateTime.setSeconds(0);

        let count = 0,
            leftLimitDate: Date = selectedDateTime || currentDateTime;

        options.forEach((el: TimeOption, i) => {
            if (isToday && currentDateTime >= el.dateTime) {
                el.disabled = true;
            }

            if (showAll) {
                el.visible =  true;
            } else {
                if (el.dateTime >= leftLimitDate) {
                    el.visible = (count < 4);

                    count++;
                } else {
                    if (options.length - 4 <= i && count < 4) {
                        el.visible = true;
                        count++;
                    } else {
                        el.visible = false;
                    }
                }
            }
        });

        const selectedTime: Date = selectedDateTime || options.find(option => !option.disabled)?.dateTime || options.find(option => option.visible)?.dateTime

        options = this.setSelectDate(options, selectedTime);

        return options;
    }
}