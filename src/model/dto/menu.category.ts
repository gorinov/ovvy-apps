export class MenuCategory {
    id: number;
    enabled: boolean = true;
    name: string = '';
    description: string = '';
    sort: number = 1;
    configId: number;
    count: number = 0;
    isDefault: boolean = false;

    constructor(configId: number) {
        this.configId = configId;
    }
}
