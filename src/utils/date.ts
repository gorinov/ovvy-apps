export interface IWorkingTime {
    Monday: IWorkingDay;
    Tuesday: IWorkingDay;
    Wednesday: IWorkingDay;
    Thursday: IWorkingDay;
    Friday: IWorkingDay;
    Saturday: IWorkingDay;
    Sunday: IWorkingDay;
}

export interface IWorkingDay {
    index: number;
    open: string;
    close: string;
    isWorking: boolean;
    label: string;
}

export class DateUtil {
    public static generateTime(): IWorkingTime {
        return {
            Monday: {
                index: 1,
                open: '10:00',
                close: '22:00',
                isWorking: true,
                label: 'Понедельник',
            },
            Tuesday: {
                index: 2,
                open: '10:00',
                close: '22:00',
                isWorking: true,
                label: 'Вторник',
            },
            Wednesday: {
                index: 3,
                open: '10:00',
                close: '22:00',
                isWorking: true,
                label: 'Среда',
            },
            Thursday: {
                index: 4,
                open: '10:00',
                close: '22:00',
                isWorking: true,
                label: 'Четверг',
            },
            Friday: {
                index: 5,
                open: '10:00',
                close: '23:00',
                isWorking: true,
                label: 'Пятница',
            },
            Saturday: {
                index: 6,
                open: '10:00',
                close: '23:00',
                isWorking: true,
                label: 'Суббота',
            },
            Sunday: {
                index: 0,
                open: '10:00',
                close: '22:00',
                isWorking: true,
                label: 'Воскресенье',
            },
        };
    }

    public static format(date: Date) {
        return date.toLocaleString('ru', { day: 'numeric', month: 'long', weekday: 'short' });
    }

    public static resolve(date: Date | string) {
        const currentDate: Date = new Date();

        if (typeof date === 'string') {
            date = new Date(Date.parse(date));
        }

        if (date.getTime() < currentDate.getTime()) {
            return currentDate;
        }

        return date;
    }

    public static clone(date: Date) {
        return new Date(date.getTime());
    }

    public static resetDate(date: Date): Date {
        let clearDate = this.clone(date),
            nowDate = new Date();

        clearDate.setFullYear(nowDate.getFullYear());
        clearDate.setMonth(nowDate.getMonth(), nowDate.getDate());

        return clearDate;
    }

    public static isEqualDate(date1: Date, date2: Date) {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    }

    public static getDateByWorkingDay(workingDay: IWorkingDay, date: Date = new Date()): Date[] {
        const startMode = date.ovClone();
        const endMode = date.ovClone();

        let arStartMode = workingDay.open.split(':'),
            arEndMode = workingDay.close.split(':');

        let startHour = parseInt(arStartMode[0]);
        let endHour = parseInt(arEndMode[0]);

        startMode.setHours(startHour);
        startMode.setMinutes(parseInt(arStartMode[1]));
        startMode.setSeconds(0);

        // Если режим работы после 00:00, то переходим на след. день
        if (endHour <= startHour) {
            endMode.setDate(endMode.getDate() + 1);
        }

        endMode.setHours(endHour);
        endMode.setMinutes(parseInt(arEndMode[1]));
        endMode.setSeconds(0);

        return [startMode, endMode];
    }

    public static getCurrentWorkingTime(workingTime: IWorkingTime): IWorkingDay {
        const currentDayName: string = new Date().toLocaleString('en', { weekday: 'long' });

        return workingTime[currentDayName];
    }

    public static isUnavailableTime(workingTime: IWorkingTime): boolean {
        const workingDay: IWorkingDay = this.getCurrentWorkingTime(workingTime);
        const [startMode, endMode] = this.getDateByWorkingDay(workingDay);
        const date: Date = new Date();

        return date <= startMode && endMode > date;
    }

    public static isBiggerTime(date1: Date, date2: Date) {
        return this.resetDate(date1).getTime() > this.resetDate(date2).getTime();
    }

    public static isLessTime(date1: Date, date2: Date) {
        return this.resetDate(date1).getTime() < this.resetDate(date2).getTime();
    }
}
