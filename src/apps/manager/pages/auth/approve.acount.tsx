import React, { useEffect, useState } from 'react';
import { UserApi } from '../../../../services/api/user-api';
import { StatusCode } from '../../../../model/api/statusCode';
import { useDispatch } from 'react-redux';
import { BaseApi } from '../../../../services/api/base.api';
import { AppTypes } from '../../../../store/reducers/app';
import { useLocation } from 'react-router-dom';
import { LinkUtil } from '../../../../utils/link';
import Loader from '../../../../components/loader';
import { UserTypes } from '../../../../store/reducers/manager/user';
import { useNavigate } from 'react-router';
import Link from '@mui/material/Link/Link';
import Alert from '@mui/material/Alert/Alert';

export default function ApproveAccount() {
    const [approveError, setApproveError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const hash: string = LinkUtil.getParam(location.search, 'hash');

    useEffect(() => {
        document.title = 'Подтверждение аккаунта | OVVY';
    });

    const loadApproveResult = async () => {
        dispatch({ type: AppTypes.LOADING });

        const approve = await UserApi.approveAccount(hash);

        dispatch({ type: AppTypes.LOADED });

        if (approve.status !== StatusCode.Success) {
            setApproveError(approve.data.message);
        } else {
            dispatch({
                type: UserTypes.LOGIN,
                payload: approve.data,
            });
        }
    };

    useEffect(() => {
        loadApproveResult().then();
    }, []);

    return (
        <>
            <div className="ov-auth__form">
                <div className="ov-auth__header">
                    <div className="ov-auth__title">
                        <h2>Подтверждение аккаунта</h2>
                    </div>

                    <img className="ov-auth__logo" src={BaseApi.baseUrl + '/assets/images/icon/logo2.png'} alt="logo" />
                </div>

                {approveError && (
                    <Alert variant="filled" severity="error">
                        {approveError}
                    </Alert>
                )}

                {!approveError && (
                    <div className="ov-auth__loading">
                        <Loader force={true} />
                    </div>
                )}

                <hr />

                <div className="ov-auth__panel">
                    <Link
                        component="button"
                        color="inherit"
                        onClick={() => {
                            navigate('/reset');
                        }}
                    >
                        Сбросить пароль
                    </Link>

                    <Link
                        component="button"
                        color="inherit"
                        onClick={() => {
                            navigate('/create');
                        }}
                    >
                        Создать аккаунт
                    </Link>
                </div>
            </div>
        </>
    );
}
