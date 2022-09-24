import React, { useEffect, useState } from 'react';
import { UserApi } from 'services/api/user-api';
import { StatusCode } from 'model/api/statusCode';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { IRootState } from 'store/reducers';
import { BaseApi } from 'services/api/base.api';
import { AppTypes } from 'store/reducers/app';
import Alert from '@mui/material/Alert/Alert';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button/Button';
import Link from '@mui/material/Link/Link';
import { AppUtil } from 'utils/app.util';

export default function Reset() {
    const loaded: boolean = useSelector((state: IRootState) => state.app.loaded);
    const [form, setForm] = useState({
        email: '',
    });
    const [resetSuccess, setResetSuccess] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Сброс пароля | OVVY';
    });

    async function handleSubmit(e) {
        e.preventDefault();

        dispatch({ type: AppTypes.LOADING });

        const reset = await UserApi.reset(form.email);

        dispatch({ type: AppTypes.LOADED });

        if (reset.status !== StatusCode.Success) {
            AppUtil.showErrorSnackbar(reset.data.message);
        } else {
            setResetSuccess(reset.data.message);
        }

        setForm({ ...form, email: '' });
    }

    const handleChange = (e): void => {
        const [name, value] = AppUtil.getNameValue(e);

        setForm({ ...form, [name]: value });
    };

    return (
        <form className={'ov-auth__form' + (!loaded ? ' -loading' : '')} onSubmit={handleSubmit}>
            <div className="ov-auth__header">
                <div className="ov-auth__title">
                    <h2>Сброс пароля</h2>
                    <span>На указанный почтовый адрес будет отправлена ссылка на сброс пароля</span>
                </div>

                <img className="ov-auth__logo" src={BaseApi.baseUrl + '/assets/images/icon/logo2.png'} alt="logo" />
            </div>

            {resetSuccess && (
                <Alert variant="filled" severity="success">
                    {resetSuccess}
                </Alert>
            )}

            {!resetSuccess && (
                <>
                    <div>
                        <div className="ov-auth__field">
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <Button type="submit" fullWidth variant="contained" color="primary" size="large">
                        Отправить
                    </Button>
                </>
            )}

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
