import { DateUtil, IWorkingTime } from '../../utils/date';
import { CompanyBuilder } from '../../builder/company';

export class Company {
    id: string;
    enabled: boolean = false;
    name: string = '';
    city: string;
    cityId: number = window.ovvy?.cityID || 1;
    categories: ICompanyCategory[];
    address: string[] = [''];
    images: ICompanyImage[] = [];
    mainImage: string;
    rating: number;
    ratingVotes: number;
    coordinate: number[][] = [];
    phone: string[] = [''];
    email: string;
    kitchen: number[] = [];
    features: number[] = [];
    payment: number[] = [];
    links: string[] = [''];
    price: number;
    workingTime: IWorkingTime = DateUtil.generateTime();
    description: string;
    companyLink: string;
    parsed: boolean = false;
    timestamp: number = Date.now();

    constructor() {
        const initData = window.companyData;

        if (initData) {
            this.payment = [73, 74];
            this.parsed = true;

            if (initData.name) {
                this.name = initData.name;
            }

            if (initData.sectionID) {
                this.cityId = initData.sectionID;
            }

            if (initData.categories) {
                this.categories = initData.categories.map(
                    (id: number, index: number) =>
                        ({
                            id: id,
                            main: index === 0,
                        } as ICompanyCategory)
                );
            }

            if (initData.address) {
                this.address = [initData.address];
            }

            if (initData.phone) {
                this.phone = initData.phone;
            }

            if (initData.coords) {
                this.coordinate = [initData.coords];
            }

            if (initData.features) {
                this.features = initData.features;
            }

            if (initData.kitchen) {
                this.kitchen = initData.kitchen;
            }

            if (initData.description) {
                this.description = initData.description;
            }

            if (initData.instagram || initData.vk || initData.site) {
                this.links.splice(0);
            }

            if (initData.instagram) {
                this.links.push(initData.instagram);
            }

            if (initData.vk) {
                this.links.push(initData.vk);
            }

            if (initData.site) {
                this.links.push(initData.site);
            }

            if (initData.images) {
                this.images = initData.images.map(
                    (src: string, index: number) =>
                        ({
                            src: src,
                            main: index === 0,
                        } as ICompanyImage)
                );
            }

            if (initData.workingTime) {
                CompanyBuilder.buildWorkingTime(this, initData.workingTime);
            }
        }
    }
}

export interface ICompanyCategory {
    id: number;
    code: string;
    name: string;
    main: boolean;
}

export interface ICompanyImage {
    src: string;
    main: boolean;
}
