import React, { useEffect, useState } from 'react';
import { User } from 'model/dto/user';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { IUserState, UserTypes } from 'store/reducers/manager/user';
import { AppTypes } from 'store/reducers/app';
import { UserApi } from 'services/api/user-api';
import { StatusCode } from 'model/api/statusCode';
import { PasswordField } from 'components/form/password';
import { IRootState } from 'store/reducers';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import Alert from '@mui/material/Alert/Alert';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button/Button';
import { AppUtil } from 'utils/app.util';

export const UserPage = () => {
    const userState: IUserState = useSelector(
        (state: IRootState) => state.user,
        (a, b) => a.user.name === b.user.name
    );
    const [user, setUser] = useState<User>(userState.user);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = 'Информация об аккаунте | OVVY';
    });

    const save = async (e) => {
        e.preventDefault();

        dispatch({ type: AppTypes.LOADING });

        const auth = await UserApi.update(user);

        dispatch({ type: AppTypes.LOADED });

        if (auth.status !== StatusCode.Success) {
            setSaveError(auth.data.message);
        } else {
            setSaveSuccess('Данные обновлены');
            dispatch({
                type: UserTypes.UPDATE,
                payload: auth.data,
            });
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();

        dispatch({ type: AppTypes.LOADING });

        const auth = await UserApi.changePassword(user.oldPassword, user.newPassword);

        dispatch({ type: AppTypes.LOADED });

        if (auth.status !== StatusCode.Success) {
            setSaveError(auth.data.message);
        } else {
            setUser({ ...user, newPassword: '', oldPassword: '' });
            setSaveSuccess('Пароль обновлён');
        }
    };

    const handleChange = (e): void => {
        const [name, value] = AppUtil.getNameValue(e);

        setUser({ ...user, [name]: value });
    };

    return (
        <>
            <Snackbar open={!!saveError} autoHideDuration={3000} onClose={() => setSaveError(null)}>
                <Alert severity="error">{saveError}</Alert>
            </Snackbar>

            <Snackbar open={!!saveSuccess} autoHideDuration={3000} onClose={() => setSaveSuccess(null)}>
                <Alert severity="success">{saveSuccess}</Alert>
            </Snackbar>

            <div className="ov-form">
                <h2>Основная информация</h2>

                <section className="ov-form__section">
                    <form className="ov-form" onSubmit={save}>
                        <div className="ov-form__row">
                            <div className="ov-form__field">
                                <TextField name="name" label="Имя" value={user.name} onChange={handleChange} fullWidth required />
                            </div>
                        </div>

                        <Button variant="contained" type="submit" size="medium" color="primary">
                            Сохранить
                        </Button>
                    </form>
                </section>

                <h2>Изменения пароля</h2>

                <section className="ov-form__section">
                    <form className="ov-form" onSubmit={changePassword}>
                        <Alert severity="info">Для подтверждения изменения пароля требуется ввести текущий пароль</Alert>

                        <hr />
                        <div className="ov-form__row">
                            <div className="ov-form__field">
                                <PasswordField
                                    variant={'standard'}
                                    value={user.oldPassword}
                                    name={'oldPassword'}
                                    label={'Текущий пароль'}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="ov-form__row">
                            <div className="ov-form__field">
                                <PasswordField
                                    variant={'standard'}
                                    value={user.newPassword}
                                    name={'newPassword'}
                                    label={'Новый пароль'}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <Button variant="contained" type="submit" size="medium" color="primary">
                            Изменить
                        </Button>
                    </form>
                </section>
            </div>
        </>
    );
};
