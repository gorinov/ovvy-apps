export enum Unit {
    Kilogram = 'kilogram',
    Portion = 'portion',
    Liter = 'liter',
    Gram = '100gram'
}

export interface CatalogItem {
    id: number;
    name: string;
    weight?: string;
    description?: string;
    price: number;
    unitCode: Unit;
    unitText: string;
    quantity: number;
    image?: string;
    categoryId: number
}