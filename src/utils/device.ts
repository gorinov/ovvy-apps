export class Device {
    private static mobileWidth = 767;
    private static laptopWidth = 1024;

    static get isMobile(): boolean {
        return document.body.clientWidth <= this.mobileWidth;
    }

    static get isLaptop(): boolean {
        return document.body.clientWidth <= this.laptopWidth;
    }

    static get isDesktop(): boolean {
        return document.body.clientWidth > this.mobileWidth;
    }
}
