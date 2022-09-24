
export class TimeOption {
    dateTime: Date;
    time: string = '';
    visible: boolean = true;
    selected: boolean = false;
    disabled: boolean = false;

    constructor(dateTime: Date) {
        this.dateTime = dateTime.ovClone();
        this.time = (dateTime.getHours() === 0 ? '00' : dateTime.getHours().toString())
            + ":"
            + (dateTime.getMinutes() === 0 ? '00' : dateTime.getMinutes().toString())
    }
}