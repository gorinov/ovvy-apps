import React from 'react';

export const Confirm = ({ popupRef, onConfirm }) => {
    return (
        <div className="ov-confirm">
            <div className="ov-confirm__title">Создать новый заказ?</div>
            <div className="ov-confirm__controls">
                <div className="ov-button -default" onClick={onConfirm}>
                    Да
                </div>
                <div className="ov-button -cancel" onClick={() => popupRef?.current.close()}>
                    Нет
                </div>
            </div>
        </div>
    );
};
