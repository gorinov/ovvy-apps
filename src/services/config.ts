import { Core } from 'model/enum/core';

export class Config {
    public static menuAppBaseUrl = 'https://menu.ovvy.ru/';
    public static menuBasketKey = 'ov-basket';
    public static menuOrderHash = 'ov-hash';
    public static menuOrderLink = 'ov-link';

    private static _instance: Config = null;

    component: Core;
    provider: number;
    menuId: number;
    orderId: string;

    constructor() {
        if (Config._instance) {
            throw new Error('Error: Instantiation failed: Use Setting.getInstance() instead of new.');
        }
        Config._instance = this;
    }

    public static getInstance(): Config {
        if (Config._instance === null) {
            Config._instance = new Config();
        }

        return Config._instance;
    }

    init(appParams: AppParams) {
        this.component = appParams.component;
        this.provider = appParams.provider;
        this.menuId = appParams.menuId;
        this.orderId = appParams.orderId;
    }
}
