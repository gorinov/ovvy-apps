import React, { useEffect, useState } from 'react';
import { UserApi } from 'services/api/user-api';
import { StatusCode } from 'model/api/statusCode';
import { useDispatch, useSelector } from 'react-redux';
import { BaseApi } from 'services/api/base.api';
import { AppTypes } from 'store/reducers/app';
import { useLocation } from 'react-router-dom';
import { LinkUtil } from 'utils/link';
import { UserTypes } from 'store/reducers/manager/user';
import { useNavigate } from 'react-router';
import { IRootState } from 'store/reducers';
import { PasswordField } from 'components/form/password';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button/Button';
import Link from '@mui/material/Link/Link';
import { AppUtil } from 'utils/app.util';

export default function ApproveRegistration() {
    const loaded: boolean = useSelector((state: IRootState) => state.app.loaded);
    const [form, setForm] = useState({
        name: '',
        password: '',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const hash: string = LinkUtil.getParam(location.search, 'hash');

    useEffect(() => {
        AppUtil.setTitle('Подтверждение регистрации');
    });

    async function handleSubmit(e) {
        e.preventDefault();

        dispatch({ type: AppTypes.LOADING });

        const approve = await UserApi.approveRegistration(form.name, form.password, hash);

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

    const handleChange = (e): void => {
        const [name, value] = AppUtil.getNameValue(e);

        setForm({ ...form, [name]: value });
    };

    return (
        <form className={'ov-auth__form' + (!loaded ? ' -loading' : '')} onSubmit={handleSubmit}>
            <div className="ov-auth__header">
                <div className="ov-auth__title">
                    <h2>Завершение регистрации</h2>
                    <span>Введите имя и пароль для своей учётной записи</span>
                </div>

                <img className="ov-auth__logo" src={BaseApi.baseUrl + '/assets/images/icon/logo2.png'} alt="logo" />
            </div>

            <div>
                <div className="ov-auth__field">
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="name"
                        label="Имя"
                        name="name"
                        autoFocus
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="ov-auth__field">
                    <PasswordField value={form.password} onChange={handleChange} />
                </div>
            </div>

            <Button type="submit" fullWidth variant="contained" color="primary" size="large">
                Завершить
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
                    Войти
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
        </form>
    );
}
