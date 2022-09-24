import React, { useEffect, useState } from 'react';
import { UserApi } from 'services/api/user-api';
import { StatusCode } from 'model/api/statusCode';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { UserTypes } from 'store/reducers/manager/user';
import { AppTypes } from 'store/reducers/app';
import { BaseApi } from 'services/api/base.api';
import { IRootState } from 'store/reducers';
import { PasswordField } from 'components/form/password';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button/Button';
import Link from '@mui/material/Link/Link';
import { AppUtil } from 'utils/app.util';
import { Alert } from '@mui/material';

export default function SignIn() {
    const loaded: boolean = useSelector((state: IRootState) => state.app.loaded);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        AppUtil.setTitle('Вход');
    });

    async function handleSubmit(e) {
        e.preventDefault();

        dispatch({ type: AppTypes.LOADING });

        const auth = await UserApi.signIn(form.email, form.password);

        dispatch({ type: AppTypes.LOADED });

        if (auth.status !== StatusCode.Success) {
            AppUtil.showErrorSnackbar(auth.data.message);
        } else {
            dispatch({
                type: UserTypes.LOGIN,
                payload: auth.data,
            });
        }
    }

    const handleChange = (e): void => {
        const name = e.target.name,
            value = e.target.value;

        setForm({ ...form, [name]: value });
    };

    return (
        <form className={'ov-auth__form' + (!loaded ? ' -loading' : '')} onSubmit={handleSubmit}>
            <div className="ov-auth__header -with-message">
                <div className="ov-auth__title">
                    <h2>Вход</h2>
                    <span>Чтобы продолжить, пожалуйста, авторизуйтесь</span>
                </div>

                <img className="ov-auth__logo" src={BaseApi.baseUrl + '/assets/images/icon/logo2.png'} alt="logo" />
            </div>

            <Alert severity="info" className="ov-auth__message">
                Впервые на ovvy.ru? <br />
                <span className="ov-link" onClick={() => navigate('/create')}>
                    Создайте аккаунт
                </span>
                , чтобы начать пользоваться
            </Alert>

            <div>
                <div className="ov-auth__field">
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        type="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                    />
                </div>
                <div className="ov-auth__field">
                    <PasswordField value={form.password} onChange={handleChange} />
                </div>
            </div>

            <Button type="submit" fullWidth variant="contained" color="primary" size="large">
                Войти
            </Button>

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
        </form>
    );
}
