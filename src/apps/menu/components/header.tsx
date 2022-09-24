import React, { useRef, useState } from 'react';
import { MenuAppTypes, MenuMode } from 'store/reducers/menu/menu';
import { useNavigate } from 'react-router-dom';
import MenuIcon from 'images/icons/menu.svg';
import InfoIcon from 'images/icons/info.svg';
import { WaySelector, WayState } from 'apps/menu/components/way.selector';
import { IAppState } from 'store/reducers/app';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import { Popup } from 'apps/menu/components/popup';
import { Confirm } from 'apps/menu/components/confirm';
import { Info } from 'apps/menu/components/info';
import { Metric } from 'utils/metric';

export const Header = ({ loaded, mode, settings }) => {
    const navigate = useNavigate();
    const appState: IAppState = useSelector((state: IRootState) => state.app);
    const [clearPopup, setClearPopup] = useState(null);
    const [infoPopup, setInfoPopup] = useState(null);
    const clearPopupRef = useRef<any>();
    const dispatch = useDispatch();

    return (
        <div className={'ov-header' + ' -' + mode}>
            {clearPopup && (
                <Popup
                    onClose={() => setClearPopup(null)}
                    ref={clearPopupRef}
                    content={
                        <Confirm
                            popupRef={clearPopupRef}
                            onConfirm={() => {
                                clearPopupRef.current.close();
                                dispatch({ type: MenuAppTypes.CLEAR });
                                navigate('/');
                            }}
                        />
                    }
                />
            )}

            {infoPopup && <Popup onClose={() => setInfoPopup(null)} content={<Info settings={settings} />} />}

            <div className="ov-header__column">
                {loaded && (
                    <div
                        className="ov-header__logo"
                        onClick={() => {
                            if (mode == MenuMode.Check) {
                                setClearPopup(true);
                            } else {
                                navigate('/');
                            }
                        }}
                    >
                        <MenuIcon className="ov-header__icon" />
                    </div>
                )}
                <div className="ov-header__title">
                    {loaded && (
                        <>
                            <b>Меню</b>
                            {settings.title}
                        </>
                    )}
                </div>
            </div>

            {loaded && (
                <div className="ov-header__column">
                    {settings.delivery && (
                        <div
                            className="ov-header__info"
                            onClick={() => {
                                setInfoPopup(true);

                                Metric.reachGoal('open-restaurant-info');
                            }}
                        >
                            <InfoIcon className="ov-header__info-icon" />
                            <div className="ov-header__info-text">Информация о {settings.type.toLowerCase()}</div>
                        </div>
                    )}

                    {!appState.isLaptop && mode == MenuMode.Menu && (
                        <div className="ov-header__selector">
                            <WaySelector state={WayState.Header} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
