import {CompanyApi} from "../../services/api/company-api";
import {CompanyBuilder} from "../../builder/company";
import {CompanyInfo, CompanySavedResponse} from "../../model/api/company";
import {Company} from "../../model/dto/company";
import {StatusCode} from "../../model/api/statusCode";
import {CompanyTypes} from "../reducers/company";
import {DeliveryApi} from "../../services/api/delivery.api";

export class DeliveryActions {
    static getCompany(id: number) {
        return async dispatch => {
            try {
                dispatch({
                    type: CompanyTypes.LOADING
                });

                const company: CompanyInfo = await DeliveryApi.getCompany(id);

                if (company) {
                    dispatch({
                        type: CompanyTypes.LOADED,
                        payload: CompanyBuilder.build(company)
                    })
                } else {
                    dispatch({
                        type: CompanyTypes.LOADED
                    })
                }
            } catch (e) {
                dispatch({
                    type: CompanyTypes.LOADING_ERROR
                })
            }
        }
    }
}