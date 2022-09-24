import React, { useEffect, useState } from 'react';
import { AppTypes, IAppState, SnackbarMessageKind } from 'store/reducers/app';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SignIn from './pages/auth/sign-in';
import Create from './pages/auth/create';
import Loader from 'components/loader';
import Layout from './layout';
import 'styles/manager/main.scss';
import { IUserState } from 'store/reducers/manager/user';
import { IRootState } from 'store/reducers';
import { Metric } from 'utils/metric';
import { BaseApi } from 'services/api/base.api';
import { UserActions } from 'store/actions/user';
import Theme from 'components/theme';
import NotFound from './components/not-found';
import { CompanyPage } from './pages/company';
import { BookingSettingsPage } from './pages/booking.settings';
import { BookingRequestsPage } from './pages/booking.requests';
import { OfferPage } from './pages/offers';
import { FeedbackPage } from './pages/feedback';
import { UserPage } from './pages/user';
import Reset from './pages/auth/reset';
import ApproveAccount from './pages/auth/approve.acount';
import ApprovePassword from './pages/auth/approve.password';
import ApproveRegistration from './pages/auth/approve.registration';
import { MenuSettingsPage } from 'apps/manager/pages/menu.settings';
import { MenuPage } from 'apps/manager/pages/menu';
import { CompanyCreatePage } from 'apps/manager/pages/company.create';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import Alert from '@mui/material/Alert/Alert';
import { MenuRequestsPage } from 'apps/manager/pages/menu.requests';

function ManagerApp() {
    const appState: IAppState = useSelector((state: IRootState) => state.app);
    const userState: IUserState = useSelector(
        (state: IRootState) => state.user,
        (a, b) => a.isAuth === b.isAuth
    );
    const [userVerified, setUserVerified] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const unverifiedRoutes = ['/signin', '/create', '/reset', '/approve-password', '/approve-account', '/approve-registration'];

    useEffect(() => {
        Metric.init(83191084);
    }, []);

    React.useEffect(() => {
        Metric.hit('/manager' + location.pathname);
    }, [location]);

    useEffect(() => {
        dispatch({ type: AppTypes.LOADED });

        if (!userState.isAuth) {
            setUserVerified(false);

            if (unverifiedRoutes.indexOf(location.pathname) < 0) {
                navigate('/signin');
            }
        } else {
            if (!BaseApi.getToken()) {
                return;
            }

            dispatch(
                UserActions.validate(
                    () => {
                        if (unverifiedRoutes.indexOf(location.pathname) > -1) {
                            navigate('/');
                        }

                        setUserVerified(true);
                    },
                    () => {
                        navigate('/signin');
                    }
                )
            );
        }
    }, [userState.isAuth]);

    return (
        <div className="ov -manager">
            <Theme>
                <Loader />

                {userVerified && (
                    <Layout>
                        <Routes>
                            <Route path="/user" element={<UserPage />} />
                            <Route path="/feedback" element={<FeedbackPage />} />
                            <Route path="/offers" element={<OfferPage />} />
                            <Route path="/booking/requests" element={<BookingRequestsPage />} />
                            <Route path="/booking/settings" element={<BookingSettingsPage />} />
                            <Route path="/menu/items" element={<MenuPage />} />
                            <Route path="/menu/requests" element={<MenuRequestsPage />} />
                            <Route path="/menu/settings" element={<MenuSettingsPage />} />
                            <Route path="/create-company" element={<CompanyCreatePage />} />
                            <Route path={'/'} element={<CompanyPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Layout>
                )}

                {!userVerified && (
                    <div className="ov-auth">
                        <Routes>
                            <Route path="/create" element={<Create />} />
                            <Route path="/signin" element={<SignIn />} />
                            <Route path="/reset" element={<Reset />} />
                            <Route path="/approve-account" element={<ApproveAccount />} />
                            <Route path="/approve-password" element={<ApprovePassword />} />
                            <Route path="/approve-registration" element={<ApproveRegistration />} />
                        </Routes>
                    </div>
                )}

                {appState.snackbarMessage && (
                    <Snackbar
                        open={true}
                        autoHideDuration={appState.snackbarMessage.kind === SnackbarMessageKind.Success ? 3000 : null}
                        onClose={() => dispatch({ type: AppTypes.HIDE_SNACKBAR })}
                    >
                        <Alert severity={appState.snackbarMessage.kind} onClose={() => dispatch({ type: AppTypes.HIDE_SNACKBAR })}>
                            {appState.snackbarMessage.text}
                        </Alert>
                    </Snackbar>
                )}
            </Theme>
        </div>
    );
}

export default ManagerApp;
