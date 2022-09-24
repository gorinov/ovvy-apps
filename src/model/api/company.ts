import { ICompanyCategory } from '../dto/company';
import { BaseResponse } from './base.response';

export interface IWorkingTimeInfo {
    [day: string]: string;
}

export interface CompanyInfo {
    id: string;
    enabled: boolean;
    name: string;
    address: string[];
    images: string[];
    rating: number;
    ratingVotes: number;
    coord: string[];
    mainCategoryId: number;
    categories: ICompanyCategory[];
    cityId: number;
    phone: string[];
    kitchen: number[];
    features: number[];
    price: number;
    links: string[];
    workingTime: IWorkingTimeInfo;
    description: string;
    companyLink: string;
    email: string;
    timestamp: number;
}

export interface CompanySavedResponse extends BaseResponse {
    data: {
        company: CompanyInfo;
        message: string;
    };
}
