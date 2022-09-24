import {CatalogBuilder} from "../../builder/catalog";
import {CatalogCategory} from "../../model/dto/catalog-category";

export interface ICatalogState {
    loaded: boolean;
    errorMessage?: string;
    catalog: CatalogCategory[];
}

const initialState = {
    loaded: false,
    catalog: []
};

export enum CatalogTypes {
    LOADING = 'CATALOG_LOADING',
    LOADED = 'CATALOG_LOADED',
    LOADING_ERROR = 'CATALOG_LOADING_ERROR',
    SAVING = 'CATALOG_SAVING',
    SAVED = 'CATALOG_SAVED',
    SAVING_ERROR = 'CATALOG_SAVING_ERROR',
    CLEAR_ERROR = 'CLEAR_ERROR',
}

export default function(state = initialState, action) {
    switch (action.type) {
        case CatalogTypes.LOADED:
            let catalog = action.payload;

            return {catalog: CatalogBuilder.build(catalog), loaded: true};
        default:
            return state;
    }
}