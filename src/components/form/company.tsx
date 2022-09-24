import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from 'store/reducers';
import { CompanyTypes, ICompanyState } from 'store/reducers/company';
import { CompanyActions } from 'store/actions/company';
import { SettingActions } from 'store/actions/manager/setting';
import Loader from '../loader';
import { ISettingState } from 'store/reducers/manager/setting';
import { YMaps, Map, ZoomControl, GeoObject } from 'react-yandex-maps';
import debounce from 'lodash/debounce';
import { Company, ICompanyCategory } from 'model/dto/company';
import FormControl from '@mui/material/FormControl';
import { BaseApi } from 'services/api/base.api';
import { IWorkingDay } from 'utils/date';
import WorkingTime from '../shared/working-time';
import Gallery from '../shared/gallery';
import InputMask from 'react-input-mask';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { CompanyUtil } from 'utils/company';
import NotCompany from 'apps/manager/components/not-company';
import Alert from '@mui/material/Alert/Alert';
import TextField from '@mui/material/TextField/TextField';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Chip from '@mui/material/Chip/Chip';
import Button from '@mui/material/Button/Button';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Select from '@mui/material/Select/Select';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import { IUserState } from 'store/reducers/manager/user';
import { Editor } from '@tinymce/tinymce-react';
import FormLabel from '@mui/material/FormLabel/FormLabel';

export enum CompanyFormMode {
    CreatePortal = 'CreatePortal',
    Create = 'Create',
    Update = 'Update',
}

function CompanyForm({ mode = CompanyFormMode.CreatePortal }) {
    const companyState: ICompanyState = useSelector((state: IRootState) => state.company);
    const formState: ISettingState = useSelector((state: IRootState) => state.manager);
    const userState: IUserState = useSelector((state: IRootState) => state.user);
    const dispatch = useDispatch();
    const [company, setCompany] = useState<Company>(new Company());
    const [loading, setIsLoading] = useState(true);
    const getCityCoordinate = (cityId: number): number[] => {
        const city = formState?.setting?.cities.find((city) => city.id == cityId);

        return city?.coord.split(',');
    };
    const coordinate = company?.coordinate?.[0] || getCityCoordinate(company?.cityId);
    const isCreateMode: boolean = mode === CompanyFormMode.CreatePortal || mode === CompanyFormMode.Create;

    const updateCompanyCoordinate = useCallback(
        debounce(async (company: Company, address: string, index: number) => {
            company.coordinate[index] = await BaseApi.getCoordinate(address);
            setCompany({ ...company, coordinate: company.coordinate });
        }, 500),
        []
    );
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(!formState.loaded || !companyState.loaded);
    }, [formState.loaded, companyState.loaded]);

    // Загрузка компании
    useEffect(() => {
        if (!companyState.loaded) {
            if (mode === CompanyFormMode.CreatePortal) {
                dispatch({
                    type: CompanyTypes.LOADED,
                    payload: company,
                });
            } else if (mode === CompanyFormMode.Create || CompanyUtil.needUpdate(companyState.company?.timestamp, company.timestamp)) {
                dispatch(CompanyActions.getCompany());
            }
        } else {
            if (mode === CompanyFormMode.Create) {
                if (companyState.company) {
                    navigate('/');
                }
                updateField('email', userState.user.email);
                return;
            }
            setCompany(companyState.company);
        }
    }, [companyState.loaded]);

    // Загрузка настроек компаний
    useEffect(() => {
        if (!formState.loaded) {
            dispatch(SettingActions.getFormCompanyData());
        }
    }, [formState.loaded]);

    const save = (e) => {
        e.preventDefault();

        dispatch(
            CompanyActions.saveCompany(company, userState.user.id, () => {
                if (mode === CompanyFormMode.CreatePortal) {
                    navigate('/success');
                }
            })
        );
    };

    const handleChange = (e: any): void => {
        let name: string = e.target.name,
            value: any = e.target.value,
            checked: boolean = e.target.checked,
            matches: RegExpMatchArray = name.match(/\[(\d+)\]/);

        if (matches) {
            let index: number = parseInt(matches[1]);
            name = matches['input'].slice(0, matches.index);
            let arrayValue = company[name];

            if (name === 'kitchen' || name === 'features' || name === 'payment') {
                let id: number = formState.setting.properties[name][index].id;
                if (!checked) {
                    arrayValue = arrayValue.filter((existId: number) => existId !== id);
                } else {
                    arrayValue.push(id);
                }
            } else {
                arrayValue[index] = value;
            }

            updateField(name, arrayValue);

            if (name === 'address') {
                updateCompanyCoordinate(company, value, index);
            }

            return;
        }

        if (name === 'categories') {
            value = value.map((category) => {
                if (isMainCategory(category) || !company.categories || (isCreateMode && !value.find((category) => category.main))) {
                    category.main = true;
                }

                return category;
            });
        }

        updateField(name, value);
    };

    const updateWorkingTime = (dayCode: string, workingDay: IWorkingDay) => {
        setCompany((prevState) => {
            return {
                ...prevState,
                workingTime: {
                    ...prevState.workingTime,
                    dayCode: workingDay,
                },
            };
        });
    };

    const updateField = (fieldName: string, fieldValue: any): void => {
        setCompany((prevCompany) => {
            if (fieldName === 'cityId') {
                prevCompany.categories = undefined;
            }

            return {
                ...prevCompany,
                [fieldName]: fieldValue,
            };
        });
    };

    const addControl = (name: string): void => {
        setCompany({ ...company, [name]: [...company[name], ''] });
    };

    const removeControl = (name: string, index: number): void => {
        company[name].splice(index, 1);

        updateField(name, company[name]);

        if (name === 'address') {
            let coordinate = company.coordinate;

            if (coordinate[index]) {
                updateField('coordinate', coordinate.splice(index, 1));
            }
        }
    };

    const isCheckedCategory = (category: ICompanyCategory): boolean => {
        return !!company.categories?.find((selectedCategory: ICompanyCategory) => selectedCategory.id === category.id);
    };

    const isMainCategory = (category: ICompanyCategory): boolean => {
        return !!company.categories?.find((selectedCategory: ICompanyCategory) => selectedCategory.id === category.id)?.main;
    };

    const setMainCategory = (category: ICompanyCategory): void => {
        setCompany({
            ...company,
            categories: company.categories.map((selectedCategory: ICompanyCategory) => {
                selectedCategory.main = selectedCategory.id === category.id;

                return selectedCategory;
            }),
        });
    };

    const isCheckedKitchen = (id: number): boolean => {
        return company.kitchen?.indexOf(id) > -1;
    };

    const isCheckedFeature = (id: number): boolean => {
        return company.features?.indexOf(id) > -1;
    };

    const isCheckedPayment = (id: number): boolean => {
        return company.payment?.indexOf(id) > -1;
    };

    if (loading) {
        return <Loader force={true} />;
    }

    if (!company) {
        return <NotCompany />;
    }

    return (
        <>
            <form className="ov-form" onSubmit={save}>
                {company.id && !company.enabled && (
                    <div className="ov-form__message">
                        <Alert severity="info">Заведение находится на модерациии и будет опубликовано после её завершения</Alert>
                    </div>
                )}

                <section className="ov-form__section">
                    {company.companyLink && company.enabled && (
                        <>
                            <div className="ov-form__row">
                                <div className="ov-form__field -link -full">
                                    <span className="ov-form__label">Ссылка на страницу:</span>
                                    <a className="ov-link -secondary" href={company.companyLink} target="_blank">
                                        {company.companyLink}
                                    </a>
                                </div>
                            </div>
                            <hr />
                        </>
                    )}

                    <div className="ov-form__row">
                        <div className="ov-form__field">
                            <TextField name="name" label="Название" value={company.name} onChange={handleChange} fullWidth required />
                        </div>

                        {isCreateMode && (
                            <div className="ov-form__field">
                                <FormControl fullWidth>
                                    <InputLabel id="city">Город</InputLabel>
                                    <Select
                                        labelId="city"
                                        label="Город"
                                        name="cityId"
                                        value={company.cityId}
                                        onChange={handleChange}
                                        required
                                    >
                                        {formState.setting.cities.map((city: any) => (
                                            <MenuItem key={city.id} value={city.id}>
                                                {city.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        )}

                        <div className="ov-form__field">
                            <FormControl fullWidth>
                                <InputLabel id="categories">Категории</InputLabel>
                                <Select
                                    labelId="categories"
                                    name="categories"
                                    label="Категории"
                                    renderValue={(selected) =>
                                        (selected as ICompanyCategory[])
                                            .sort((a, b) => +b.main - +a.main)
                                            .map((selected) => selected.name)
                                            .join(', ')
                                    }
                                    value={formState.setting?.categories[company.cityId].filter(isCheckedCategory)}
                                    onChange={handleChange}
                                    required
                                    multiple
                                >
                                    {formState.setting?.categories[company.cityId].map((category) => {
                                        const isMain: boolean = isMainCategory(category),
                                            isSelected: boolean = isCheckedCategory(category);

                                        return (
                                            <MenuItem
                                                key={category.id}
                                                disabled={mode === CompanyFormMode.Update && isMain}
                                                value={category}
                                            >
                                                <Checkbox checked={isSelected} />
                                                <ListItemText primary={category.name} />

                                                {isSelected && isMain && <Chip color="secondary" label="Основная категория" />}

                                                {isSelected && !isMain && isCreateMode && (
                                                    <Chip
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMainCategory(category);
                                                        }}
                                                        label="Сделать основной"
                                                    />
                                                )}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </section>

                <h2>Контакты</h2>
                <section className="ov-form__section">
                    {mode === CompanyFormMode.CreatePortal && (
                        <>
                            <div className="ov-form__row">
                                <div className="ov-form__field">
                                    <TextField
                                        name="email"
                                        type="email"
                                        label="Эл. почта представителя"
                                        value={company.email}
                                        onChange={handleChange}
                                        fullWidth
                                        helperText="Адрес будет использован для получения доступа к личному кабинету"
                                    />
                                </div>
                            </div>

                            <hr />
                        </>
                    )}

                    <div className="ov-form__row">
                        <div className="ov-form__field">
                            {company.address.map((address, index) => {
                                const addressLabel = 'Адрес' + (company.address.length > 1 ? ' (' + (index + 1) + ')' : '');

                                return (
                                    <div className={'ov-form__control-container'} key={index}>
                                        <TextField
                                            name={'address[' + index + ']'}
                                            label={addressLabel}
                                            value={address}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                        {company.address.length > 1 && (
                                            <span className={'ov-form__control-action'} onClick={() => removeControl('address', index)}>
                                                <ClearIcon />
                                            </span>
                                        )}
                                    </div>
                                );
                            })}

                            <div className={'ov-form__button-container'}>
                                <Button variant="outlined" size="small" color="secondary" onClick={() => addControl('address')}>
                                    Добавить ещё +
                                </Button>
                            </div>
                        </div>

                        <div className="ov-form__field">
                            {company.phone.map((phone, index) => {
                                const phoneLabel = 'Телефон' + (company.phone.length > 1 ? ' (' + (index + 1) + ')' : '');

                                return (
                                    <div className={'ov-form__control-container'} key={index}>
                                        <InputMask mask="+9 (999) 999-99-99" value={phone} onChange={handleChange}>
                                            <TextField name={'phone[' + index + ']'} type="phone" label={phoneLabel} fullWidth required />
                                        </InputMask>

                                        {company.phone.length > 1 && (
                                            <span className={'ov-form__control-action'} onClick={() => removeControl('phone', index)}>
                                                <ClearIcon />
                                            </span>
                                        )}
                                    </div>
                                );
                            })}

                            <div className={'ov-form__button-container'}>
                                <Button variant="outlined" size="small" color="secondary" onClick={() => addControl('phone')}>
                                    Добавить ещё +
                                </Button>
                            </div>
                        </div>

                        <div className="ov-form__field">
                            {company.links.map((link, index) => {
                                const linkLabel = 'Ссылка' + (company.links.length > 1 ? ' (' + (index + 1) + ')' : '');

                                return (
                                    <div className={'ov-form__control-container'} key={index}>
                                        <TextField
                                            name={'links[' + index + ']'}
                                            label={linkLabel}
                                            value={link}
                                            onChange={handleChange}
                                            fullWidth
                                            helperText="Укажите ссылку на instagram, vk и др."
                                        />

                                        {company.links.length > 1 && (
                                            <span className={'ov-form__control-action'} onClick={() => removeControl('links', index)}>
                                                <ClearIcon />
                                            </span>
                                        )}
                                    </div>
                                );
                            })}

                            <div className={'ov-form__button-container'}>
                                <Button variant="outlined" size="small" color="secondary" onClick={() => addControl('links')}>
                                    Добавить ещё +
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Alert className="ov__inner-alert" severity="info">
                        Заполните поле "Адрес", маркер на карте появится автоматически, после чего вы сможете скорректировать местоположение
                    </Alert>

                    <div className="ov-form__map">
                        <YMaps>
                            <Map
                                className="ov-map"
                                defaultState={{
                                    center: coordinate,
                                    zoom: 13,
                                    controls: [],
                                }}
                                state={{
                                    center: coordinate,
                                    zoom: 13,
                                    controls: [],
                                }}
                                modules={['layout.ImageWithContent']}
                            >
                                <ZoomControl
                                    options={{
                                        size: 'small',
                                        position: {
                                            top: 150,
                                            left: 10,
                                        },
                                    }}
                                />
                                {company.coordinate &&
                                    company.coordinate.map((coordinate, index) => {
                                        return (
                                            <GeoObject
                                                key={index}
                                                onDragend={(e: any) => {
                                                    company.coordinate[index] = e.originalEvent.target.geometry.getCoordinates();
                                                    updateField('coordinate', company.coordinate);
                                                }}
                                                geometry={{
                                                    type: 'Point',
                                                    coordinates: coordinate,
                                                }}
                                                options={{
                                                    draggable: true,
                                                    iconLayout: 'default#image',
                                                    iconImageHref:
                                                        "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><path fill='%23e00000' d='M14.88 9.75l4.46-2.42c0 3.54-2.47 7.59-4.64 11.07L11 24l1.67-10.33 2.21-3.92z'/><circle cx='12' cy='7.33' r='7.33' fill='%23f33'/><circle cx='12' cy='7.33' r='3' fill='%23fff'/></svg>",
                                                    iconImageSize: [48, 48],
                                                    iconImageOffset: [-24, -48],
                                                }}
                                            />
                                        );
                                    })}
                            </Map>
                        </YMaps>
                    </div>
                </section>

                <h2>Описание</h2>
                <section className="ov-form__section">
                    <Editor
                        value={company.description}
                        apiKey="orls95nscc6ock2nry02hdnucoanb8f64yf634jjv2y4x6dk"
                        init={{
                            branding: false,
                            height: 500,
                            menubar: false,
                            block_formats: 'Paragraph=p; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6',
                            plugins: [
                                'advlist',
                                'autolink',
                                'lists',
                                'link',
                                'image',
                                'charmap',
                                'preview',
                                'anchor',
                                'searchreplace',
                                'visualblocks',
                                'code',
                                'fullscreen',
                                'insertdatetime',
                                'media',
                                'table',
                                'help',
                                'wordcount',
                            ],
                            toolbar:
                                'undo redo | blocks | ' +
                                'bold italic | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat',
                        }}
                        onEditorChange={(value) => updateField('description', value)}
                    />
                </section>

                <h2>Фотографии</h2>
                <section className="ov-form__section">
                    <Gallery company={company} setCompany={setCompany} />
                </section>

                <h2>Кухня</h2>
                <section className="ov-form__section">
                    <div className="ov-form__checkbox-container">
                        {formState.setting.properties.kitchen.map((kitchen: any, index: number) => (
                            <div className={'ov-form__checkbox'} key={index}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isCheckedKitchen(kitchen.id)}
                                            onChange={handleChange}
                                            name={`kitchen[${index}]`}
                                        />
                                    }
                                    label={kitchen.name}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <h2>Оплата</h2>
                <section className="ov-form__section">
                    <div className="ov-form__row">
                        <div className="ov-form__field">
                            <TextField
                                name="price"
                                label="Средний счёт (руб.)"
                                value={company.price}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </div>
                    </div>

                    <div className="ov-form__row">
                        <div className="ov-form__field">
                            {formState.setting.properties.payment.map((payment: any, index: number) => (
                                <div className={'ov-form__checkbox'} key={index}>
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox
                                                checked={isCheckedPayment(payment.id)}
                                                onChange={handleChange}
                                                name={`payment[${index}]`}
                                            />
                                        }
                                        label={payment.name}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <h2>Преимущества</h2>
                <section className="ov-form__section">
                    <div className="ov-form__checkbox-container">
                        {formState.setting.properties.features.map((feature: any, index: number) => (
                            <div className={'ov-form__checkbox'} key={index}>
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Checkbox
                                            checked={isCheckedFeature(feature.id)}
                                            onChange={handleChange}
                                            name={`features[${index}]`}
                                        />
                                    }
                                    label={feature.name}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <h2>График работы</h2>

                <section className="ov-form__section">
                    <WorkingTime workingTime={{ ...company.workingTime }} update={updateWorkingTime} />
                </section>

                <section className={mode === CompanyFormMode.CreatePortal ? 'ov-form__submit' : 'ov__panel'}>
                    <Button
                        variant="contained"
                        type="submit"
                        size={mode === CompanyFormMode.CreatePortal ? 'large' : 'medium'}
                        color="primary"
                    >
                        {mode === CompanyFormMode.CreatePortal ? 'Отправить' : 'Сохранить'}
                    </Button>
                </section>
            </form>
        </>
    );
}

export default CompanyForm;
