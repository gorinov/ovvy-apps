import {CatalogItem} from "./catalog-item";

export interface CatalogCategory {
    id: number;
    name: string;
    items: CatalogItem[]
}