import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import { MenuAppState, MenuAppTypes } from 'store/reducers/menu/menu';
import _ from 'lodash';
import { MenuItem } from 'model/dto/menu.item';
import { Card } from 'apps/menu/components/card';
import { BasketItem } from 'model/dto/basket.item';
import { MenuCategory } from 'model/dto/menu.category';
import { Popup } from 'apps/menu/components/popup';
import { Basket } from 'apps/menu/components/basket';
import { WaySelector, WayState } from 'apps/menu/components/way.selector';
import { IAppState } from 'store/reducers/app';
import { BasketPanel } from 'apps/menu/components/basket.panel';
import { SpecialOffers } from 'apps/menu/components/special.offers';
import { Metric } from 'utils/metric';

export const MenuPage = ({ settings, basket }) => {
    const appState: IAppState = useSelector((state: IRootState) => state.app);
    const menuState: MenuAppState = useSelector((state: IRootState) => state.menuApp);
    const dispatch = useDispatch();
    const grouping = _.groupBy(settings?.items, (item) => item.categoryId);
    const isEmpty =
        !settings?.items.length || (!settings.showDisabledMenuItems && !_.filter(settings.items, (item) => item.enabled).length);
    const navRef = useRef<HTMLElement>();
    const categoriesRef = useRef<HTMLDivElement>();
    const [menuItemPopup, setMenuItemPopup] = useState(null);
    const container = document.querySelector('.ov');

    useEffect(() => {
        if (!container) {
            return;
        }

        const throttleNavigationFunction = _.throttle(handleNavigation, 50);

        container.addEventListener('scroll', throttleNavigationFunction);
        container.addEventListener('resize', throttleNavigationFunction);

        handleNavigation();

        document.title = document.title ?? 'Электронное QR-меню ' + menuState.settings.title;

        return () => {
            container.removeEventListener('scroll', throttleNavigationFunction);
            container.removeEventListener('resize', throttleNavigationFunction);
        };
    }, [container]);

    const cardItem = (item, isPopup: boolean = false) => (
        <Card
            {...item}
            key={item.id}
            type={isPopup ? 'popup' : ''}
            quantity={_.find(basket, (basketItem: BasketItem) => basketItem.item.id === item.id)?.quantity}
            onClick={() => {
                if (!appState.isMobile || isPopup) {
                    return;
                }

                setMenuItemPopup(item);
                Metric.reachGoal('open-menu-item');
            }}
            addToBasket={(e) => {
                e.stopPropagation();
                dispatch({ type: MenuAppTypes.ADD_TO_BASKET, payload: item });

                Metric.reachGoal('add-to-basket');
            }}
            removeFromBasket={(e) => {
                e.stopPropagation();
                dispatch({ type: MenuAppTypes.REMOVE_FROM_BASKET, payload: item });

                Metric.reachGoal('remove-from-basket');
            }}
        />
    );

    const handleNavigation = () => {
        if (!navRef.current) {
            return;
        }

        if (navRef.current.getBoundingClientRect().top <= 0) {
            navRef.current.classList.add('-fixed');
        } else {
            navRef.current.classList.remove('-fixed');
        }

        if (!categoriesRef.current) {
            return;
        }

        let activeId;
        _.forEach(categoriesRef.current.children, (category) => {
            if (category.getBoundingClientRect().top <= navRef.current.offsetHeight + 20) {
                activeId = category.getAttribute('data-nav-target');
            }
        });

        _.forEach(_.first(navRef.current.children).children, (item, index: number) => {
            if (!activeId && index === 0) {
                item.classList.add('-active');
            } else {
                item.getAttribute('data-nav') != activeId ? item.classList.remove('-active') : item.classList.add('-active');
            }
        });
    };

    const scrollToCategory = (categoryId: number): void => {
        let category = document.querySelector(`[data-nav-target='${categoryId}']`);

        if (!category) {
            return;
        }

        container.scroll({
            top: container.scrollTop + category.getBoundingClientRect().top - navRef.current.offsetHeight,
            behavior: 'smooth',
        });
    };

    return (
        <div className="ov-page">
            {menuState.loaded && <BasketPanel basket={basket} />}
            {menuItemPopup && <Popup onClose={() => setMenuItemPopup(null)} content={cardItem(menuItemPopup, true)} />}

            <div className="ov-container">
                <div className={'ov-menu' + (settings?.delivery ? ' -with-selector' : '')}>
                    {appState.isLaptop && <WaySelector state={WayState.Menu}></WaySelector>}

                    <SpecialOffers />

                    {menuState.loaded && settings.categories.length > 1 && (
                        <nav className="ov-nav" ref={navRef}>
                            <ul className="ov-nav__wrapper">
                                {_.map(settings.categories, (menuCategory: MenuCategory, index: number) => (
                                    <li
                                        className={'ov-nav__item' + (index === 0 ? ' -active' : '')}
                                        onClick={() => scrollToCategory(menuCategory.id)}
                                        data-nav={menuCategory.id}
                                        key={menuCategory.id}
                                    >
                                        {menuCategory.name}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    {menuState.loaded && isEmpty && <div className="ov-message -info">Меню пока пусто, загляните позже</div>}

                    {menuState.loaded && !settings.categories && (
                        <div className="ov-menu__items">{_.map(settings.items, (item: MenuItem) => cardItem(item))}</div>
                    )}

                    {menuState.loaded && settings.categories && (
                        <div className="ov-menu__categories" ref={categoriesRef}>
                            {_.map(settings.categories, (menuCategory: MenuCategory) => {
                                const items = _.filter(grouping[menuCategory.id], (item: MenuItem) =>
                                    settings.showDisabledMenuItems ? true : item.enabled
                                );

                                if (!items.length) {
                                    return;
                                }

                                const showCategory = settings.categories.length > 1 || !menuCategory.isDefault;
                                return (
                                    <div className="ov-menu__category" data-nav-target={menuCategory.id} key={menuCategory.id}>
                                        {showCategory && <h2 className="ov-menu__category-name">{menuCategory.name}</h2>}
                                        <div className="ov-menu__items">{_.map(items, (item) => cardItem(item))}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {!menuState.loaded && (
                        <div className="ov-menu__items">
                            {_.map(_.range(10), (i: number) => (
                                <Card key={i} isLoading={true} />
                            ))}
                        </div>
                    )}
                </div>
                <Basket loaded={menuState.loaded} />
            </div>
        </div>
    );
};
