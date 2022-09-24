import { Company } from 'model/dto/company';

export enum CompanyTypes {
    LOADING = 'COMPANY_LOADING',
    LOADED = 'COMPANY_LOADED',
    LOADING_ERROR = 'COMPANY_LOADING_ERROR',
    SAVING = 'COMPANY_SAVING',
    SAVED = 'COMPANY_SAVED',
}

export interface ICompanyState {
    loaded: boolean;
    errorMessage?: string;
    company: Company;
}

const initialState: ICompanyState = {
    loaded: false,
    company: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CompanyTypes.LOADING:
            return { ...state, loaded: false, errorMessage: null };
        case CompanyTypes.LOADED:
            return { ...state, company: action.payload, loaded: true, errorMessage: null };
        case CompanyTypes.SAVING:
            return { ...state, loaded: false, errorMessage: null };
        case CompanyTypes.SAVED:
            return { ...state, company: action.payload, errorMessage: null, loaded: true };
        default:
            return state;
    }
}
