import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Switch from '@mui/material/Switch/Switch';
import Button from '@mui/material/Button/Button';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import { MenuActions } from 'store/actions/manager/menu';
import { IMenuManagerState } from 'store/reducers/manager/menu';
import { City, MenuSettings } from 'model/dto/menu.settings';
import { AppUtil } from 'utils/app.util';
import TextField from '@mui/material/TextField/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Autocomplete, InputAdornment, Stack } from '@mui/material';
import QRCode from 'qrcode';
import { LogUtil } from 'utils/log';
import { Config } from 'services/config';
import { MenuApi } from 'services/api/menu.api';
import IconButton from '@mui/material/IconButton/IconButton';
import InputMask from 'react-input-mask';
import Alert from '@mui/material/Alert/Alert';
import WorkingTime from 'components/shared/working-time';
import { IWorkingDay } from 'utils/date';
import _ from 'lodash';
import Telegram from 'apps/manager/components/telegram';
import { KeyValuePair } from 'model/enum/core';
import { BaseApi } from 'services/api/base.api';
import Chip from '@mui/material/Chip/Chip';

export const MenuSettingsPage = () => {
    const menuState: IMenuManagerState = useSelector((state: IRootState) => state.menuManager);
    const [settings, setSettings] = useState<MenuSettings>(new MenuSettings());
    const [domainValidationMessage, setDomainValidationMessage] = useState<string>();
    const dispatch = useDispatch();
    const qrcodeRef = useRef();
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        document.title = 'Настройка электронного меню | OVVY';
    }, []);

    // Загрузка настроек
    useEffect(() => {
        if (!menuState.settingsLoaded) {
            dispatch(MenuActions.getSettings());
        } else {
            setSettings(menuState.settings);
            updateQRCode(menuState.settings.domain);
        }
    }, [menuState.settingsLoaded, menuState.settings?.id, menuState.version]);

    const save = async (e?) => {
        e?.preventDefault();

        const domainIsValid = await MenuApi.checkDomain(settings.domain, settings.id);
        if (!domainIsValid) {
            setDomainValidationMessage('Адрес уже занят, выберите другой');
            return;
        }

        dispatch(MenuActions.saveSettings(settings));
    };

    const downloadQRCode = (size: number) => {
        QRCode.toDataURL(
            Config.menuAppBaseUrl + settings.domain,
            {
                margin: 2,
                width: size,
            },
            (e, url) => {
                if (e) LogUtil.error(e);

                AppUtil.downloadBase64File(url, 'qr-code.png');
            }
        );
    };

    const updateQRCode = (value: string) => {
        QRCode.toCanvas(
            qrcodeRef.current,
            Config.menuAppBaseUrl + value,
            {
                margin: 2,
                width: 200,
            },
            (e) => {
                if (e) LogUtil.error(e);
            }
        );
    };

    const onSearch = (e: any): void => {
        if (!e) {
            return;
        }

        const value: string = e.target.value;

        setSearch(e.target.value);
        if (value) {
            BaseApi.getCity(value).then((result) => {
                setOptions(result);
            });
        }
    };

    const handleChange = (e: any): void => {
        let [name, value] = AppUtil.getNameValue(e);
        const matches: RegExpMatchArray = name.match(/\[(\d+)\]/);

        if (matches) {
            name = matches['input'].slice(0, matches.index);
            if (name === 'city') {
                const index: number = parseInt(matches[1]);
                settings[name][index]['name'] = value;
                value = settings[name];
            }
        }

        if (name === 'domain') {
            let isValid = true;

            if (value.length < 3) {
                setDomainValidationMessage('Адрес должен содержать больше 2-х символов');
                isValid = false;
            }

            if (isValid && value.length > 99) {
                setDomainValidationMessage('Адрес должен содержать меньшн 100 символов');
                isValid = false;
            }

            if (isValid && !value.match(/^[a-z0-9_-]+$/)) {
                setDomainValidationMessage('Адрес содержит запрещённые символы');
                isValid = false;
            }

            if (isValid) {
                setDomainValidationMessage(null);
                updateQRCode(value);
            }
        }

        setSettings((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const addCity = (city: City) => {
        setSettings((prevState) => {
            return {
                ...prevState,
                city: [...prevState.city, city],
            };
        });
    };

    const removeCity = (city: City) => {
        setSettings((prevState) => {
            return {
                ...prevState,
                city: _.filter(prevState.city, (prevCity) => prevCity.id !== city.id),
            };
        });
    };

    const updateDeliveryTime = (dayCode: string, workingDay: IWorkingDay) => {
        setSettings((prevState) => {
            return {
                ...prevState,
                deliveryTime: {
                    ...prevState.deliveryTime,
                    [dayCode]: workingDay,
                },
            };
        });
    };

    return (
        <>
            <h1 className="ov-title">Настройки электронного меню</h1>

            {menuState.settingsLoaded && (
                <form className="ov-form" onSubmit={save}>
                    <section className="ov-form__section">
                        <div className="ov-form__row">
                            <div className="ov-form__column">
                                <div className="ov-form__field -full">
                                    <FormLabel component="legend">Статус модуля</FormLabel>

                                    <FormControlLabel
                                        control={
                                            <Switch checked={settings.enabled} value={'switch'} name={'enabled'} onChange={handleChange} />
                                        }
                                        label={settings.enabled ? 'Включено' : 'Выключено'}
                                    />
                                </div>

                                <div className="ov-form__field -full">
                                    <TextField
                                        name="type"
                                        type="text"
                                        label="Тип заведения"
                                        value={settings.type}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        inputProps={{ maxLength: 255 }}
                                    />
                                    <div className="ov-form__helper-text">Например, кафе или ресторан</div>
                                </div>

                                <div className="ov-form__field -full">
                                    <TextField
                                        name="name"
                                        type="text"
                                        label="Название"
                                        value={settings.name}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                    />
                                </div>

                                <div className="ov-form__field -full">
                                    <TextField
                                        name="domain"
                                        type="text"
                                        label="Ссылка на меню"
                                        value={settings.domain}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        error={!!domainValidationMessage}
                                        helperText={domainValidationMessage}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">{Config.menuAppBaseUrl}</InputAdornment>,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => AppUtil.copyToClipboard(Config.menuAppBaseUrl + settings.domain)}
                                                    >
                                                        <ContentCopyIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <div className="ov-form__helper-text">
                                        QR-код будет вести на этот адрес, здесь будет отображаться меню
                                    </div>
                                </div>

                                <div className="ov-form__field -full">
                                    <FormLabel component="legend">Отображение неактивные позиции меню</FormLabel>

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.showDisabledMenuItems}
                                                value={'switch'}
                                                name={'showDisabledMenuItems'}
                                                onChange={handleChange}
                                            />
                                        }
                                        label={settings.showDisabledMenuItems ? 'Включено' : 'Выключено'}
                                    />
                                </div>
                            </div>

                            <div className="ov-form__column">
                                <div className="ov-qrcode">
                                    <canvas ref={qrcodeRef}></canvas>

                                    <div className="ov-qrcode__panel">
                                        <Button variant="outlined" onClick={() => downloadQRCode(250)} size="small" color="primary">
                                            250x250
                                        </Button>
                                        <Button variant="outlined" onClick={() => downloadQRCode(500)} size="small" color="primary">
                                            500x500
                                        </Button>
                                        <Button variant="outlined" onClick={() => downloadQRCode(500)} size="small" color="primary">
                                            1000x1000
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <h2>Доставка</h2>

                    <section className="ov-form__section">
                        <div className="ov-form__row">
                            <div className="ov-form__field -default">
                                <FormLabel component="legend">Статус доставки</FormLabel>

                                <FormControlLabel
                                    control={
                                        <Switch checked={settings.delivery} value={'switch'} name={'delivery'} onChange={handleChange} />
                                    }
                                    label={settings.delivery ? 'Включено' : 'Выключено'}
                                />
                            </div>
                        </div>
                        <div className="ov-form__row">
                            <div className="ov-form__field -default">
                                <InputMask
                                    name="phone"
                                    type="tel"
                                    className="ov-form__control"
                                    mask={!!settings.phone ? '+9 999 999 9999' : null}
                                    value={settings.phone}
                                    onChange={handleChange}
                                    required={settings.delivery}
                                >
                                    <TextField name="phone" type="text" label="Телефон" required fullWidth />
                                </InputMask>
                            </div>
                        </div>
                        <div className="ov-form__row">
                            <div className="ov-form__field">
                                <TextField
                                    name="minPrice"
                                    type="number"
                                    label="Минимальная сумма заказа"
                                    value={settings.minPrice}
                                    onChange={handleChange}
                                    fullWidth
                                    inputProps={{ maxLength: 255 }}
                                />
                                <div className="ov-form__helper-text">Оставьте поле пустым, чтобы принимать заказы с любой ценой</div>
                            </div>
                        </div>

                        <h3>Населённые пункты для доставки</h3>
                        <div className="ov-form__row">
                            <div className="ov-form__field">
                                <Autocomplete
                                    disablePortal
                                    freeSolo
                                    value={search}
                                    options={options}
                                    blurOnSelect={true}
                                    onInputChange={onSearch}
                                    onChange={(event, result: KeyValuePair) => {
                                        setSearch('');

                                        const data = result.data;
                                        if (data.kladr_id) {
                                            addCity(
                                                new City(
                                                    data.kladr_id,
                                                    data.city || data.settlement,
                                                    data.city_type_full || data.settlement_type_full,
                                                    data.region,
                                                    data.region_type_full
                                                )
                                            );
                                        }
                                    }}
                                    getOptionLabel={(option) => {
                                        if (typeof option === 'string') {
                                            return option;
                                        }

                                        return option.value;
                                    }}
                                    renderOption={(props, option) => <li {...props}>{option.value}</li>}
                                    renderInput={(params) => {
                                        const { InputLabelProps, InputProps, ...rest } = params;

                                        return <TextField label="Название" {...params.InputProps} {...rest} fullWidth />;
                                    }}
                                />
                            </div>
                        </div>

                        <Stack direction="row" spacing={1}>
                            {_.map(settings.city, (city: City) => (
                                <Chip key={city.id} label={city.name} variant="outlined" onDelete={() => removeCity(city)} />
                            ))}
                        </Stack>
                    </section>

                    <h2>Режим работы доставки</h2>
                    <section className="ov-form__section">
                        <Alert severity="info">В указанные промежутки времени клиенты смогут совершать заказы</Alert>

                        <br />

                        <div className="ov-form__row">
                            <div className="ov-form__field -full">
                                <WorkingTime workingTime={{ ...settings.deliveryTime }} update={updateDeliveryTime} />
                            </div>
                        </div>
                    </section>

                    <h2>Оповещение о заявках</h2>

                    <section className="ov-form__section">
                        <h3>Telegram</h3>

                        <Telegram id={settings.id} usernameList={_.map(settings.telegram, 'username')} kind={'menu'} />

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

                    <section className="ov__panel">
                        <Button variant="contained" type="submit" size="medium" color="primary">
                            Сохранить
                        </Button>
                    </section>
                </form>
            )}
        </>
    );
};
