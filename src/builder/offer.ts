import { Offer } from '../model/dto/offer';
import { OfferInfo } from '../model/api/offer';
import { Api } from '../utils/api';

export class OfferBuilder {
    static build(offerInfo: OfferInfo): Offer {
        let offer: Offer = new Offer();

        offer.id = offerInfo.id;
        offer.name = offerInfo.title || offerInfo.name;
        offer.description = offerInfo.description;
        offer.image = offerInfo.image;
        offer.showInSite = offerInfo.showInSite;
        offer.showInMenu = offerInfo.showInMenu;
        offer.imageId = offerInfo.imageId;
        offer.sort = offerInfo.sort;
        offer.createdDate = new Date(offerInfo.createdDate * 1000);

        return offer;
    }
}
