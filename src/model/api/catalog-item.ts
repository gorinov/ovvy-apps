import {Unit} from "../dto/catalog-item";

export interface CatalogItemInfo {
    id: number;
    name: string;
    price: number;
    unit: Unit;
    weight?: string;
    description?: string;
    quantity: number;
    image: string;
}