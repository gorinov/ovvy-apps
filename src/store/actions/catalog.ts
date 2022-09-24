import {CompanyApi} from "../../services/api/company-api";
import {CompanyBuilder} from "../../builder/company";
import {CompanyInfo, CompanySavedResponse} from "../../model/api/company";
import {Company} from "../../model/dto/company";
import {StatusCode} from "../../model/api/statusCode";
import {CompanyTypes} from "../reducers/company";
import {DeliveryApi} from "../../services/api/delivery.api";
import store from "../store";
import {CatalogTypes} from "../reducers/catalog";

export class CatalogActions {
    static getCatalog(id: number) {
        return async dispatch => {
            try {
                dispatch({
                    type: CatalogTypes.LOADING
                });

                const catalog: any = await DeliveryApi.getCatalog(id);

                dispatch({
                    type: CatalogTypes.LOADED,
                    payload: catalog
                })
            } catch (e) {
                dispatch({
                    type: CatalogTypes.LOADING_ERROR
                })
            }
        }
    }
}