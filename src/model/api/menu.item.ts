export class MenuItemInfo {
    id: number;
    enabled: boolean;
    name: string;
    description: string;
    sort: number;
    configId: number;
    categoryId: number;
    priceAfterDiscount: number;
    priceBeforeDiscount: number;
    image: string;
    imageId: string;
    message?: string;
    weight: number;
    weightUnit: number;
    calories: number;
}
