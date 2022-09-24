import React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import { IUserState } from 'store/reducers/manager/user';
import Alert from '@mui/material/Alert/Alert';
import Button from '@mui/material/Button/Button';
import { useNavigate } from 'react-router';

export const NotCompany = () => {
    const userState: IUserState = useSelector((state: IRootState) => state.user);
    const navigate = useNavigate();

    return (
        <Alert severity="info">
            Для Вашего аккаунта нет доступных заведений. Если Ваше заведение есть на портале{' '}
            <a className="ov-link" href="//ovvy.ru" target="_blank">
                ovvy.ru
            </a>
            , напишите на{' '}
            <a className="ov-link -secondary" href="mailto:info@ovvy.ru">
                info@ovvy.ru
            </a>{' '}
            с почтового адреса {userState.user.email}, прикрепив ссылку на страницу заведения, чтобы получить доступ.
            <br /> <br />
            Или создайте заведение сейчас. Перед публикацией оно пройдёт модерацию и проверку на дубли.
            <br /> <br />
            <Button color="secondary" variant="outlined" onClick={() => navigate('/create-company')}>
                Создать
            </Button>
        </Alert>
    );
};

export default NotCompany;
