import React from 'react';
import store from 'store/store';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateUtil } from 'utils/date';
import ru from 'date-fns/locale/ru';
import ArrowIcon from 'images/icons/arrow.svg';
import CalendarIcon from 'images/icons/calendar.svg';
import { Text } from 'utils/text';
import InputMask from 'react-input-mask';
import { UserTypes } from 'store/reducers/manager/user';
import { Guest } from 'model/dto/guest';
import { BookingSettings } from 'model/dto/booking.settings';
import { BookingUtil } from 'utils/booking.util';
import { BookingTime } from './booking.time';

interface IState {
    guest: Guest;
    focusableField: FormField | null;
    addressHints: string[];
    motivator: string;
}

enum FormField {
    Date = 'date',
    Time = 'time',
    Name = 'name',
    Phone = 'phone',
    Persons = 'persons',
    Email = 'email',
    Comment = 'comment',
}

interface IProps {
    onSubmit: () => void;
    guest?: Guest;
    history?: any;
}

class CheckOutBooking extends React.Component<IProps, IState> {
    persons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
    minDate: Date = new Date();
    maxDate: Date = this.minDate.ovAddYears(1);
    excludeDates: Date[] = [];
    settings: BookingSettings;

    constructor(props) {
        super(props);

        this.settings = props.settings;
        let savedGuestData = props.guest;
        if (savedGuestData) {
            savedGuestData.date = new Date();

            if (!savedGuestData.persons || savedGuestData.persons < 1 || parseInt(savedGuestData.persons) > 10) {
                savedGuestData.persons = '2';
            }
        }

        let disabledDays: number[] = [];
        for (let day in props.settings.bookingTime) {
            if (!props.settings.bookingTime[day].isWorking) {
                disabledDays.push(props.settings.bookingTime[day].index);
            }
        }

        if (disabledDays.length) {
            for (let date: Date = this.minDate.ovClone(); date <= this.maxDate; date = date.ovAddDays(1)) {
                if (disabledDays.includes(date.getDay())) {
                    this.excludeDates.push(date);
                }
            }
        }

        this.state = {
            motivator: this.settings.lastBookingMotivatorEnabled && BookingUtil.lastBooking(this.settings.lastBookingTime),
            guest: savedGuestData || {
                persons: '2',
                date: new Date(),
            },
            ...{
                focusableField: null,
                addressHints: [],
            },
        };
    }

    isFilled = (field: FormField) => {
        return !!this.state.guest[field] || this.state.focusableField === field;
    };

    onFocus = (e, field: FormField) => {
        this.setState((prevState) => ({
            ...prevState,
            focusableField: field,
        }));
    };

    toggleFocus = (e, field: FormField) => {
        this.setState((prevState) => ({
            ...prevState,
            focusableField: prevState.focusableField === field ? null : field,
        }));
    };

    onBlur = () => {
        this.setState((prevState) => ({
            ...prevState,
            focusableField: null,
        }));
    };

    updateStore = () => {
        store.dispatch({ type: UserTypes.DATA_FILLED, payload: this.state.guest });
    };

    handleInput = (e, field?: FormField) => {
        const name = e.target.name,
            value = e.target.value;

        this.setState(
            (prevState) => ({
                ...prevState,
                guest: {
                    ...prevState.guest,
                    [name]: value,
                },
            }),
            this.updateStore
        );
    };

    selectedField = (value: any, field: FormField) => {
        this.setState(
            (prevState) => ({
                ...prevState,
                focusableField: null,
                guest: {
                    ...prevState.guest,
                    [field]: value,
                },
            }),
            this.updateStore
        );
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.onSubmit();
    };

    render() {
        return (
            <>
                <div className="ov-header">
                    <h1 className="ov-title">Бронирование столика</h1>
                </div>

                <form className={'ov-form' + (this.state.motivator ? ' -with-motivator' : '')} onSubmit={this.handleSubmit}>
                    <div className="ov-form__row">
                        <div className="ov-form__field">
                            <label
                                htmlFor={FormField.Name}
                                className={'ov-form__label' + (this.isFilled(FormField.Name) ? ' -filled' : '')}
                            >
                                Ваше имя
                            </label>
                            <input
                                className="ov-form__control"
                                type="tel"
                                name={FormField.Name}
                                onChange={this.handleInput}
                                onFocus={(e) => this.onFocus(e, FormField.Name)}
                                onBlur={this.onBlur}
                                value={this.state.guest.name}
                                required
                            />
                        </div>
                    </div>

                    <div className="ov-form__row">
                        <div className="ov-form__field">
                            <label
                                htmlFor={FormField.Phone}
                                className={'ov-form__label' + (this.isFilled(FormField.Phone) ? ' -filled' : '')}
                            >
                                Телефон
                            </label>

                            <InputMask
                                name={FormField.Phone}
                                type="tel"
                                className="ov-form__control"
                                mask={!!this.state.guest.phone ? '+9 999 999 9999' : null}
                                placeholder={this.isFilled(FormField.Phone) ? '+_ ___ ___ ____' : ''}
                                value={this.state.guest.phone}
                                onChange={this.handleInput}
                                onFocus={(e) => this.onFocus(e, FormField.Phone)}
                                onBlur={this.onBlur}
                                required
                            ></InputMask>
                        </div>
                    </div>

                    <div className="ov-form__row -nowrap">
                        <div className="ov-form__field -exempt">
                            <div
                                className={
                                    'ov-form__control -selectable' + (this.state.focusableField === FormField.Persons ? ' -open' : '')
                                }
                                onClick={(e) => this.toggleFocus(e, FormField.Persons)}
                            >
                                <div className="ov-form__control-value">
                                    {this.state.guest.persons +
                                        ' ' +
                                        Text.getNumEnding(this.state.guest.persons, ['гость', 'гостя', 'гостей'])}
                                </div>
                                <ArrowIcon className="ov-form__control-arrow" />
                            </div>
                        </div>
                        <div className="ov-form__field -exempt">
                            <div className="ov-form__control -selectable" onClick={(e) => this.toggleFocus(e, FormField.Date)}>
                                <div className="ov-form__control-value">
                                    {this.state.guest.date && DateUtil.format(this.state.guest.date)}
                                </div>
                                <CalendarIcon className="ov-form__control-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="ov-form__container">
                        <ul className={'ov-form__select -persons' + (this.state.focusableField === FormField.Persons ? ' -open' : '')}>
                            {this.persons.map((persons: any, index: number) => {
                                return (
                                    <li
                                        key={index}
                                        className={'ov-form__select-item' + (persons === this.state.guest.persons ? ' -active' : '')}
                                        onClick={() => this.selectedField(persons, FormField.Persons)}
                                    >
                                        {persons}
                                    </li>
                                );
                            })}
                        </ul>

                        <div className={'ov-form__calendar' + (this.state.focusableField === FormField.Date ? ' -open' : '')}>
                            <DatePicker
                                selected={this.state.guest.date}
                                onChange={(date) => this.selectedField(date, FormField.Date)}
                                dateFormat="dd.mm.yyyy"
                                minDate={this.minDate}
                                maxDate={this.maxDate}
                                locale={ru}
                                excludeDates={this.excludeDates}
                                inline
                            />
                        </div>
                    </div>

                    <BookingTime date={this.state.guest.date} onChange={(time) => this.selectedField(time, FormField.Time)} />

                    <div className="ov-form__switcher-container -last">
                        <div
                            className={'ov-form__switcher' + (this.state.focusableField === FormField.Comment ? ' -open' : '')}
                            onClick={(e) => this.toggleFocus(e, FormField.Comment)}
                        >
                            <div className="ov-form__switcher-label">Добавить комментарий</div>
                            <ArrowIcon className="ov-form__switcher-arrow" />
                        </div>

                        <div
                            className={
                                'ov-form__switcher-target' + (this.state.focusableField === FormField.Comment ? ' -open' : ' -close')
                            }
                        >
                            <textarea
                                className="ov-form__control -textarea -inner"
                                name={FormField.Comment}
                                onChange={this.handleInput}
                                onFocus={(e) => this.onFocus(e, FormField.Comment)}
                                value={this.state.guest.comment}
                            />
                        </div>
                    </div>

                    <div className="ov-form__button-container">
                        <button className="ov-button -booking -submit">
                            <span>Забронировать столик</span>
                        </button>
                    </div>
                </form>

                {this.state.motivator && <div className="ov-motivator">{this.state.motivator}</div>}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        guest: state.user.guest,
        settings: state.booking.settings,
    };
};

export default connect(mapStateToProps)(CheckOutBooking);
