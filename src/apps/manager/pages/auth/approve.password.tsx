import React, { useEffect, useState } from 'react';
import { UserApi } from 'services/api/user-api';
import { StatusCode } from 'model/api/statusCode';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { IRootState } from 'store/reducers';
import { BaseApi } from 'services/api/base.api';
import { AppTypes } from 'store/reducers/app';
import { useLocation } from 'react-router-dom';
import { LinkUtil } from 'utils/link';
import { PasswordField } from 'components/form/password';
import { UserTypes } from 'store/reducers/manager/user';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import Alert from '@mui/material/Alert/Alert';
import Button from '@mui/material/Button/Button';
import Link from '@mui/material/Link/Link';
import { AppUtil } from 'utils/app.util';

export default function ApprovePassword() {
    const loaded: boolean = useSelector((state: IRootState) => state.app.loaded);
    const [form, setForm] = useState({
        password: '',
    });
    const [approveError, setApproveError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const hash: string = LinkUtil.getParam(location.search, 'hash');
    const handleChange = (e) => AppUtil.handleChange(e, setForm);

    if (!hash) {
        navigate('/reset');
    }

    useEffect(() => {
        AppUtil.setTitle('Создание пароля');
    });

    async function handleSubmit(e) {
        e.preventDefault();

        dispatch({ type: AppTypes.LOADING });

        const approve = await UserApi.approvePassword(form.password, hash);

        dispatch({ type: AppTypes.LOADED });

        if (approve.status !== StatusCode.Success) {
            AppUtil.showErrorSnackbar(approve.data.message);
        } else {
            dispatch({
                type: UserTypes.LOGIN,
                payload: approve.data,
            });
        }
    }

    return (
        <form className={'ov-auth__form' + (!loaded ? ' -loading' : '')} onSubmit={handleSubmit}>
            <div className="ov-auth__header">
                <div className="ov-auth__title">
                    <h2>Создание пароля</h2>
                    <span>Введите новый пароль для своей учётной записи</span>
                </div>

                <img className="ov-auth__logo" src={BaseApi.baseUrl + '/assets/images/icon/logo2.png'} alt="logo" />
            </div>

            <div>
                <div className="ov-auth__field">
                    <PasswordField value={form.password} onChange={handleChange} />
                </div>
            </div>

            <Button type="submit" fullWidth variant="contained" color="primary" size="large">
                Отправить
            </Button>

            <hr />

            <div className="ov-auth__panel">
                <Link
                    component="button"
                    color="inherit"
                    onClick={() => {
                        navigate('/signin');
                    }}
                >
                    {'Войти'}
                </Link>
            </div>
        </form>
    );
}
