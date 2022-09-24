import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BookingActions } from 'store/actions/booking';
import { IBookingState } from 'store/reducers/booking';
import Alert from '@mui/material/Alert/Alert';
import { IRootState } from 'store/reducers';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Switch from '@mui/material/Switch/Switch';
import { BookingSettings } from 'model/dto/booking.settings';
import TextField from '@mui/material/TextField/TextField';
import WorkingTime from 'components/shared/working-time';
import Button from '@mui/material/Button/Button';
import { IWorkingDay } from 'utils/date';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import NotCompany from '../components/not-company';
import { AppUtil } from 'utils/app.util';
import Telegram from 'apps/manager/components/telegram';

export const BookingSettingsPage = () => {
    const bookingState: IBookingState = useSelector((state: IRootState) => state.booking);
    const [settings, setSettings] = useState<BookingSettings>(new BookingSettings());
    const dispatch = useDispatch();
    const handleChange = (e) => AppUtil.handleChange(e, setSettings);

    useEffect(() => {
        document.title = 'Настройки системы бронирования | OVVY';
    }, []);

    // Загрузка настроек
    useEffect(() => {
        if (!bookingState.settingsLoaded) {
            dispatch(BookingActions.getSettings());
        } else {
            setSettings(bookingState.settings);
        }
    }, [bookingState.settingsLoaded, bookingState.settings?.id, bookingState.version]);

    const updateBookingTime = (dayCode: string, workingDay: IWorkingDay) => {
        setSettings((prevState) => {
            return {
                ...prevState,
                bookingTime: {
                    ...prevState.bookingTime,
                    [dayCode]: workingDay,
                },
            };
        });
    };

    const save = (e?, successAction?) => {
        e?.preventDefault();

        dispatch(BookingActions.saveSettings(settings, successAction));
    };

    const template = () => (
        <>
            <form className="ov-form" onSubmit={save}>
                <section className="ov-form__section">
                    <FormLabel component="legend">Статус формы бронирования</FormLabel>
                    <div className="ov-form__row">
                        <div className="ov-form__field">
                            <FormControlLabel
                                control={<Switch checked={settings.active} value={'switch'} name={'active'} onChange={handleChange} />}
                                label={settings.active ? 'Включена' : 'Выключена'}
                            />
                        </div>
                    </div>

                    <div className="ov-form__row">
                        <div className="ov-form__field">
                            <FormLabel component="legend">Мотиватор "Последний раз бронировали N часов назад"</FormLabel>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.lastBookingMotivatorEnabled}
                                        value={'switch'}
                                        name={'lastBookingMotivatorEnabled'}
                                        onChange={handleChange}
                                    />
                                }
                                label={settings.lastBookingMotivatorEnabled ? 'Включен' : 'Выключен'}
                            />
                            <p className="ov-form__helper-text">
                                Мотиватор отобразится, если с последнего бронирования прошло не более 3 суток
                            </p>
                        </div>
                    </div>

                    <div className="ov-form__row">
                        <div className="ov-form__field">
                            <TextField
                                name="personsCountDefault"
                                type={'number'}
                                label="Количество гостей по умолчанию"
                                value={settings.personsCountDefault}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </div>
                    </div>
                </section>

                <h2>Оповещение о бронированиях</h2>

                <section className="ov-form__section">
                    <h3>Telegram</h3>

                    <Telegram id={bookingState.settings.providerId} usernameList={settings.telegramUsername} kind={'booking'} />

                    <hr />

                    <h3>Email</h3>

                    <div className="ov-form__row">
                        <div className="ov-form__field">
                            <TextField
                                name="email"
                                type={'email'}
                                label="Email для заявок"
                                value={settings.email}
                                onChange={handleChange}
                                fullWidth
                            />
                        </div>
                    </div>
                </section>

                <h2>Режим бронирования</h2>

                <section className="ov-form__section">
                    <Alert severity="info">
                        Если установлен флаг "Режим бронирования совпадает со временем работы", у пользователей будет возможность
                        бронировать начиная со времени открытия и до времени закрытия за вычетом 30 минут.
                    </Alert>

                    <br />

                    <div className="ov-form__row">
                        <div className="ov-form__field -full">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.bookingTimeDefaultModeEnabled}
                                        value={'switch'}
                                        name={'bookingTimeDefaultModeEnabled'}
                                        onChange={handleChange}
                                    />
                                }
                                label="Режим бронирования совпадает со временем работы"
                            />
                        </div>
                    </div>
                    {!settings.bookingTimeDefaultModeEnabled && (
                        <div className="ov-form__row">
                            <div className="ov-form__field -full">
                                <WorkingTime workingTime={{ ...settings.bookingTime }} update={updateBookingTime} />
                            </div>
                        </div>
                    )}
                </section>

                <section className="ov__panel">
                    <Button variant="contained" type="submit" size="medium" color="primary">
                        Сохранить
                    </Button>
                </section>
            </form>
        </>
    );

    return (
        <>
            <h1 className="ov-title">Настройки системы бронирования</h1>

            {bookingState.settingsLoaded && (bookingState.settings.providerId ? template() : <NotCompany />)}
        </>
    );
};
