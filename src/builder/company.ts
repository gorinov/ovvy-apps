import { CompanyInfo, IWorkingTimeInfo } from 'model/api/company';
import { Api } from 'utils/api';
import { Company, ICompanyImage } from 'model/dto/company';

export class CompanyBuilder {
    static build(companyInfo: CompanyInfo): Company {
        let company: Company = new Company();

        company.id = companyInfo.id;
        company.enabled = companyInfo.enabled;
        company.name = companyInfo.name;
        company.address = companyInfo.address;
        company.images =
            companyInfo.images &&
            companyInfo.images.map((src: string, index: number) => {
                return {
                    src: Api.baseUrl + src,
                    main: index === 0,
                } as ICompanyImage;
            });
        company.mainImage = companyInfo.images && Api.baseUrl + companyInfo.images[0];
        company.rating = companyInfo.rating;
        company.ratingVotes = companyInfo.ratingVotes;
        if (companyInfo.coord) {
            company.coordinate = companyInfo.coord.map((coordinate: string) => coordinate.split(',').map((chunk) => parseFloat(chunk)));
        }
        company.categories = companyInfo.categories;
        company.cityId = companyInfo.cityId;
        company.phone = companyInfo.phone || [''];
        company.kitchen = companyInfo.kitchen || [];
        company.features = companyInfo.features || [];
        company.links = companyInfo.links || [''];
        company.price = companyInfo.price;
        company.description = companyInfo.description;
        company.companyLink = Api.baseUrl + companyInfo.companyLink;
        company.email = companyInfo.email;

        CompanyBuilder.buildWorkingTime(company, companyInfo.workingTime);

        return company;
    }

    static buildWorkingTime(company: Company, workingTimeInfo: IWorkingTimeInfo) {
        for (let dayCode in workingTimeInfo) {
            let workingTime = workingTimeInfo[dayCode];

            if (workingTime) {
                let workingTimeParts = workingTime.split('-');

                if (workingTimeParts.length === 2) {
                    company.workingTime[dayCode].open = workingTimeParts[0].trim();
                    company.workingTime[dayCode].close = workingTimeParts[1].trim();
                    company.workingTime[dayCode].isWorking = true;
                } else {
                    company.workingTime[dayCode].isWorking = false;
                }
            } else {
                company.workingTime[dayCode].isWorking = false;
            }
        }
    }
}
