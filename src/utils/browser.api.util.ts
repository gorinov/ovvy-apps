Date.prototype.ovIsEqualDate = function (other: Date): boolean {
    return other.getFullYear() == this.getFullYear() && other.getMonth() == this.getMonth() && other.getDate() == this.getDate();
};

Date.prototype.ovDiffInDays = function (other: Date): number {
    const diffTime = this.ovResetTime().getTime() - other.ovResetTime().getTime();

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

Date.prototype.ovDiffInMonths = function (other: Date): number {
    return Math.abs(this.getMonth() - other.getMonth() + 12 * (this.getFullYear() - other.getFullYear()));
};

Date.prototype.ovResetTime = function (): Date {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
};

Date.prototype.ovSetMaxTime = function (): Date {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), 23, 59, 59);
};

Date.prototype.ovResetDate = function (): Date {
    return new Date(this.getFullYear(), this.getMonth());
};

Date.prototype.ovClone = function (): Date {
    return new Date(this.getTime());
};

Date.prototype.ovAddMinutes = function (count: number): Date {
    let date = new Date(this.valueOf());
    date.setMinutes(date.getMinutes() + count);
    return date;
};

Date.prototype.ovFormat = function (format: string): string {
    let date = new Date(this.valueOf());

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthNames = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];

    return format.replace(/(d+|m+|y+)/g, (m: any) => {
        switch (m) {
            case 'd':
                return day;
            case 'dd':
                return day < 10 ? '0' + day : day;
            case 'm':
                return month;
            case 'mm':
                return month < 10 ? '0' + month : month;
            case 'mmm':
                return monthNames[month - 1];
            case 'yy':
                return year.toString().substr(2, 2);
            case 'yyyy':
                return year;
        }

        return m;
    });
};

Date.prototype.ovAddDays = function (count: number): Date {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + count);
    return date;
};

Date.prototype.ovAddMonths = function (count: number): Date {
    let date: Date = new Date(this.valueOf()),
        day: number = date.getDate();

    date.setMonth(date.getMonth() + count);
    if (date.getDate() != day) {
        date.setDate(0);
    }

    return date;
};

Date.prototype.ovAddYears = function (count: number): Date {
    let date = new Date(this.valueOf());
    date.setFullYear(date.getFullYear() + count);
    return date;
};
