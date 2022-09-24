import React, { useEffect, useState } from 'react';
import { UserApi } from 'services/api/user-api';
import { StatusCode } from 'model/api/statusCode';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { IRootState } from 'store/reducers';
import { BaseApi } from 'services/api/base.api';
import { AppTypes } from 'store/reducers/app';
import { PasswordField } from 'components/form/password';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import Alert from '@mui/material/Alert/Alert';
import Link from '@mui/material/Link/Link';
import Button from '@mui/material/Button/Button';
import TextField from '@mui/material/TextField/TextField';
import { AppUtil } from 'utils/app.util';

export default function Create() {
    const loaded: boolean = useSelector((state: IRootState) => state.app.loaded);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [createSuccess, setCreateSuccess] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Регистрация | OVVY';
    });

    async function handleSubmit(e) {
        e.preventDefault();

        dispatch({ type: AppTypes.LOADING });

        const create = await UserApi.create(form.name, form.email, form.password);

        dispatch({ type: AppTypes.LOADED });

        if (create.status !== StatusCode.Success) {
            AppUtil.showErrorSnackbar(create.data.message);
        } else {
            setCreateSuccess(
                'Аккаунт зарегистрирован. Теперь нужно подтвердить регистрацию, перейдя по ссылке из письма, которое Вам было отправлено на ' +
                    form.email
            );
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
                    <h2>Регистрация</h2>
                    <span>Чтобы продолжить, пожалуйста, зарегистрируйтесь</span>
                </div>

                <img className="ov-auth__logo" src={BaseApi.baseUrl + '/assets/images/icon/logo2.png'} alt="logo" />
            </div>

            {createSuccess && (
                <Alert variant="filled" severity="success">
                    {createSuccess}
                </Alert>
            )}

            {!createSuccess && (
                <>
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
                                onChange={handleChange}
                            />
                        </div>
                        <div className="ov-auth__field">
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="ov-auth__field">
                            <PasswordField value={form.password} onChange={handleChange} />
                        </div>
                    </div>

                    <Button type="submit" fullWidth variant="contained" color="primary" size="large">
                        Создать
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
                    {'Войти'}
                </Link>
            </div>
        </form>
    );
}
