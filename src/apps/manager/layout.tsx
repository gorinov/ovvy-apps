import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import { IUserState, UserTypes } from 'store/reducers/manager/user';
import { AppTypes, IAppState } from 'store/reducers/app';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton/IconButton';
import RestaurantMenuIcon from '@mui/icons-material/Restaurant';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Popover from '@mui/material/Popover/Popover';
import Avatar from '@mui/material/Avatar/Avatar';
import ListItem from '@mui/material/ListItem/ListItem';
import Button from '@mui/material/Button/Button';
import Collapse from '@mui/material/Collapse/Collapse';
import List from '@mui/material/List/List';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import MenuBookIcon from '@mui/icons-material/MenuBook';

type LayoutState = {
    asidePanel: boolean;
    userPanel: any;
};

const Layout = (props) => {
    const userState: IUserState = useSelector((state: IRootState) => state.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const toggleAsideRef = useRef<HTMLDivElement>();
    const asideRef = useRef<HTMLDivElement>();
    const [layoutState, _setLayoutState] = useState<LayoutState>({
        asidePanel: false,
        userPanel: null,
    });
    const layoutStateRef = useRef<LayoutState>(layoutState);

    const setLayoutState = (state) => {
        layoutStateRef.current = state;
        _setLayoutState(state);
    };

    const update = (fieldName: string, fieldValue: any): void => {
        setLayoutState({
            ...layoutStateRef.current,
            [fieldName]: fieldValue,
        });
    };

    const [bookingIsOpen, setBookingIsOpen] = useState(location.pathname.indexOf('booking') > -1);
    const [menuIsOpen, setMenuIsOpen] = useState(location.pathname.indexOf('menu') > -1);

    React.useEffect(() => {
        if (layoutStateRef.current.asidePanel) {
            update('asidePanel', false);
        }
    }, [location]);

    const logout = () => {
        dispatch({ type: AppTypes.LOADING });
        dispatch({ type: UserTypes.LOGOUT });
    };

    useEffect(() => {
        const clickOutside = (event) => {
            if (asideRef.current.contains(event.target) || toggleAsideRef.current.contains(event.target)) {
                return;
            }

            update('asidePanel', false);
        };

        document.addEventListener('click', clickOutside);
        return () => {
            document.removeEventListener('click', clickOutside);
        };
    }, []);

    if (!userState.isAuth) {
        return <></>;
    }

    return (
        <>
            <header className="ov-header">
                <div className="ov-header__col">
                    <div
                        className="ov-header__aside-toggle"
                        ref={toggleAsideRef}
                        onClick={() => update('asidePanel', !layoutStateRef.current.asidePanel)}
                    >
                        <IconButton color="inherit" aria-label="open drawer" edge="start">
                            <MenuIcon />
                        </IconButton>
                    </div>
                </div>

                <div className="ov-header__col">
                    <div className="ov-header__panel">
                        <Avatar className="ov-header__avatar" onClick={(e) => update('userPanel', e.target)} />

                        <Popover
                            id="user-popover"
                            open={!!layoutStateRef.current.userPanel}
                            anchorEl={layoutStateRef.current.userPanel}
                            onClose={() => update('userPanel', false)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <div className="ov-header__popover">
                                <div className="ov__user-info">
                                    <div className="ov__user-info-main">
                                        {userState.user.name && <div className="ov__user-info-login">{userState.user.name}</div>}
                                        <div className="ov__user-info-label">{userState.user.email}</div>
                                    </div>
                                </div>

                                <div className="ov__menu -user">
                                    <ListItem component={NavLink} onClick={() => update('userPanel', false)} to="/user">
                                        <PersonIcon className="ov__menu-icon" />
                                        <ListItemText primary="Настройки" />
                                    </ListItem>
                                </div>

                                <Button variant="outlined" color="secondary" fullWidth onClick={logout}>
                                    Выйти
                                </Button>
                            </div>
                        </Popover>
                    </div>
                </div>
            </header>

            <aside className={`ov__aside ${layoutStateRef.current.asidePanel ? '-open' : '-hide'}`}>
                <div className="ov__aside-wrapper" ref={asideRef}>
                    <div className="ov__aside-container">
                        <div className="ov__user-info">
                            <Avatar className="ov__user-info-avatar" />

                            <div className="ov__user-info-main">
                                {userState.user.name && <div className="ov__user-info-login">{userState.user.name}</div>}
                                <div className="ov__user-info-label">{userState.user.email}</div>
                            </div>
                        </div>

                        <hr />

                        <ul className="ov__menu -left">
                            <ListItem component={NavLink} to="/">
                                <RestaurantMenuIcon className="ov__menu-icon" />
                                <span className="ov__menu-label">Заведение</span>
                            </ListItem>

                            <ListItem component={NavLink} to="/feedback">
                                <FeedbackIcon className="ov__menu-icon" />
                                <span className="ov__menu-label">Отзывы</span>
                            </ListItem>

                            <ListItem component={NavLink} to="/offers">
                                <LocalOfferIcon className="ov__menu-icon" />
                                <span className="ov__menu-label">Акции</span>
                            </ListItem>

                            <ListItem onClick={() => setMenuIsOpen(!menuIsOpen)}>
                                <MenuBookIcon className="ov__menu-icon" />
                                <span className="ov__menu-label">Электронное меню</span>
                                {menuIsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItem>

                            <Collapse in={menuIsOpen}>
                                <List component="div" disablePadding>
                                    <ListItem className="ov__menu-subitem" component={NavLink} to="/menu/items">
                                        <span className="ov__menu-label">Меню</span>
                                    </ListItem>
                                    <ListItem className="ov__menu-subitem" component={NavLink} to="/menu/requests">
                                        <span className="ov__menu-label">Заявки на доставку</span>
                                    </ListItem>

                                    <ListItem className="ov__menu-subitem" component={NavLink} to="/menu/settings">
                                        <span className="ov__menu-label">Настройки</span>
                                    </ListItem>
                                </List>
                            </Collapse>

                            {
                                <ListItem onClick={() => setBookingIsOpen(!bookingIsOpen)}>
                                    <EventNoteIcon className="ov__menu-icon" />
                                    <span className="ov__menu-label">Система бронирования</span>
                                    {bookingIsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </ListItem>
                            }

                            <Collapse in={bookingIsOpen}>
                                <List component="div" disablePadding>
                                    <ListItem className="ov__menu-subitem" component={NavLink} to="/booking/requests">
                                        <span className="ov__menu-label">Заявки</span>
                                    </ListItem>
                                    <ListItem className="ov__menu-subitem" component={NavLink} to="/booking/settings">
                                        <span className="ov__menu-label">Настройки</span>
                                    </ListItem>
                                </List>
                            </Collapse>
                        </ul>
                    </div>
                </div>
            </aside>

            <main className="ov__content">{props.children}</main>
        </>
    );
};

export default Layout;
