import store from 'store/store';
import { Device } from 'utils/device';
import { AppTypes } from 'store/reducers/app';

export class App {
    static _instance: App = null;
    static isMobile: boolean;
    static isLaptop: boolean;

    private constructor() {
        window.addEventListener('resize', () => {
            const isMobile: boolean = Device.isMobile;
            const isLaptop: boolean = Device.isLaptop;

            if (App.isMobile != isMobile) {
                App.isMobile = isMobile;

                store.dispatch({
                    type: AppTypes.SET_IS_MOBILE,
                    payload: isMobile,
                });
            }

            if (App.isLaptop != isLaptop) {
                App.isLaptop = isLaptop;

                store.dispatch({
                    type: AppTypes.SET_IS_LAPTOP,
                    payload: isLaptop,
                });
            }
        });
    }

    public static getInstance(): App {
        if (!App._instance) {
            App._instance = new App();
        }

        return App._instance;
    }
}
