export class Offer {
    id: number = null;
    name: string = '';
    description: string = '';
    image: string;
    imageId: string;
    showInSite: boolean = true;
    showInMenu: boolean = true;
    createdDate: Date = new Date();
    sort: number = 1;
}
