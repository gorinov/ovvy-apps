import { CompanyApi } from 'services/api/company-api';
import { CompanyBuilder } from 'builder/company';
import { CompanyInfo, CompanySavedResponse } from 'model/api/company';
import { Company } from 'model/dto/company';
import { StatusCode } from 'model/api/statusCode';
import { CompanyTypes } from '../reducers/company';
import { Exception } from 'sass';
import { AppUtil } from 'utils/app.util';

export class CompanyActions {
    static saveCompany(companyDto: Company, userId: number, successAction: () => void) {
        return async (dispatch) => {
            try {
                dispatch({
                    type: CompanyTypes.SAVING,
                });

                const response: CompanySavedResponse = !companyDto.id
                    ? await CompanyApi.create(companyDto, userId)
                    : await CompanyApi.saveByUser(companyDto);

                if (response.status === StatusCode.Success) {
                    dispatch({
                        type: CompanyTypes.SAVED,
                        payload: CompanyBuilder.build(response.data.company),
                    });

                    AppUtil.showSuccessSnackbar('Сохранено');

                    successAction?.();
                } else {
                    AppUtil.showErrorSnackbar(response.data.message);
                }
            } catch (e) {
                AppUtil.showErrorSnackbar((e as Exception).message);
            }
        };
    }

    static getCompany() {
        return async (dispatch) => {
            try {
                dispatch({
                    type: CompanyTypes.LOADING,
                });

                const company: CompanyInfo[] = await CompanyApi.getByUser();
                dispatch({
                    type: CompanyTypes.LOADED,
                    payload: company?.length ? CompanyBuilder.build(company[0]) : null,
                });
            } catch (e) {
                dispatch({
                    type: CompanyTypes.LOADING_ERROR,
                });
            }
        };
    }
}
