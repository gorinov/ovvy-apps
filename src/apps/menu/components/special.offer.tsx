import React, { useState } from 'react';
import { Offer } from 'model/dto/offer';
import { Popup } from 'apps/menu/components/popup';
import { Card } from 'apps/menu/components/card';
import { Metric } from 'utils/metric';

export const SpecialOffer = ({ offer, className }: { offer: Offer; className: string }) => {
    const [offerPopup, setOfferPopup] = useState(null);

    return (
        <>
            {offerPopup && (
                <Popup
                    kind={'image'}
                    onClose={() => setOfferPopup(null)}
                    content={<Card type={'popup'} name={offer.name} image={offer.image} enabled={true} description={offer.description} />}
                />
            )}

            <div
                className={'ov-offer' + (className ? ' ' + className : '')}
                onClick={() => {
                    setOfferPopup(true);
                    Metric.reachGoal('open-special-offer-item');
                }}
            >
                <div className="ov-offer__container">
                    {offer.image && (
                        <div className="ov-offer__image">
                            <img src={offer.image} alt={offer.name} />
                        </div>
                    )}
                    <div className="ov-offer__content">
                        <div className="ov-offer__name">{offer.name}</div>

                        <div className="ov-offer__description">{offer.description}</div>
                    </div>
                </div>
            </div>
        </>
    );
};
