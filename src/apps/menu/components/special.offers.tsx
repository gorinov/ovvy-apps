import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import { IOfferState } from 'store/reducers/manager/offer';
import { Offer } from 'model/dto/offer';
import { SpecialOffer } from 'apps/menu/components/special.offer';

export const SpecialOffers = () => {
    const offerState: IOfferState = useSelector((state: IRootState) => state.offer);

    return (
        <>
            {offerState.offer.length > 0 && (
                <div className="ov-offers">
                    <div className="ov-offers__container">
                        {_.map(offerState.offer, (offer: Offer) => (
                            <SpecialOffer className={'ov-offers__item'} key={offer.id} offer={offer} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
