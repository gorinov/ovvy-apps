import {CatalogItemInfo} from "./catalog-item";

export interface CatalogCategoryInfo {
    id: number;
    name: string;
    items: CatalogItemInfo[]
}