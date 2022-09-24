import React from 'react';

export const Price = ({ priceBeforeDiscount, priceAfterDiscount, currency }) => {
    return (
        <div className={'ov-price' + (priceAfterDiscount ? ' -with-discount' : '')}>
            {!!priceAfterDiscount && (
                <div className="ov-price__old">
                    {priceBeforeDiscount}
                    <span className="ov-price__currency">{currency}</span>
                </div>
            )}
            <div className="ov-price__base">
                {priceAfterDiscount ? priceAfterDiscount : priceBeforeDiscount}
                <span className="ov-price__currency">{currency}</span>
            </div>
        </div>
    );
};

export default Price;
