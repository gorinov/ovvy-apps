import { BaseApi } from './base.api';
import { CompanyInfo, CompanySavedResponse } from '../../model/api/company';
import { Company } from '../../model/dto/company';

export class CompanyApi extends BaseApi {
    public static async getByUser(): Promise<CompanyInfo[]> {
        const response = await this.instance.get('/api/company/', {
            params: {
                action: 'getCompaniesByUser',
            },
        });

        return response.data;
    }

    public static async saveByUser(company: Company): Promise<CompanySavedResponse> {
        const response = await this.instance.post('/api/company/', {
            action: 'updateCompany',
            company: company,
        });

        return response.data;
    }

    public static async create(company: Company, userId: number): Promise<CompanySavedResponse> {
        const response = await this.instance.post('/api/company/', {
            action: 'createCompany',
            company: company,
            userId: userId,
        });

        return response.data;
    }
}
