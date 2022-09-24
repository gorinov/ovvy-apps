import React from 'react';
import { connect } from 'react-redux';
import { DateUtil, IWorkingDay } from 'utils/date';
import { BookingSettings } from 'model/dto/booking.settings';
import ArrowIcon from 'images/icons/arrow.svg';

interface IProps {
    date: Date;
    booking: BookingSettings;
    onChange: (time: string) => void;
}

interface IState {
    currentTime: Date;
    options: any[];
    isShow: boolean;
    date: Date;
    hasAvailableOption: boolean;
}

interface IOption {
    date: Date;
    time: string;
    show: boolean;
    current: boolean;
    disable: boolean;
}

class TimeChoose extends React.Component<IProps, IState> {
    bookingTime;
    defaultMode;
    today: Date = new Date();

    constructor(props) {
        super(props);

        const bookingSetting = props.booking.settings;
        this.bookingTime = bookingSetting.bookingTime;
        this.defaultMode = bookingSetting.bookingTimeDefaultModeEnabled;

        const options = this.generateOptions(this.defaultMode);

        this.state = {
            date: props.date,
            currentTime: new Date(),
            options: this.setCurrentOption(options),
            hasAvailableOption: this.hasAvailableOption(options),
            isShow: false,
        };
    }

    componentDidUpdate(oldProps: IProps) {
        const date = this.props.date;

        if (oldProps.date !== date) {
            const options = this.setCurrentOption(this.generateOptions(this.defaultMode, date));

            this.setState((prevState) => ({
                ...prevState,
                date: date,
                options: options,
                hasAvailableOption: this.hasAvailableOption(options),
            }));
        }
    }

    hasAvailableOption(options: IOption[]): boolean {
        return options.filter((option: IOption) => option.show).length > 0;
    }

    generateOptions(defaultMode: boolean = true, currentTime?: Date): IOption[] {
        const currentDayName: string = this.props.date.toLocaleString('en', { weekday: 'long' });
        const dayInfo: IWorkingDay = this.bookingTime[currentDayName];

        if (!dayInfo.isWorking) {
            return [];
        }

        let bookingOpening: boolean = true,
            date: Date = new Date();

        const [startMode, endMode] = DateUtil.getDateByWorkingDay(dayInfo, this.props.date);

        if (defaultMode) {
            endMode.setMinutes(endMode.getMinutes() - 30); // чтобы режим строился не до конца рабочего дня
            // Если до открытия больше 30 минут, то разрешаем бронировать с открытия
            let differenceNowMin = (startMode.getTime() - date.getTime()) / 60000;
            if (differenceNowMin > 30) {
                bookingOpening = false;
                date.setHours(startMode.getHours());
                date.setMinutes(startMode.getMinutes());
            }
        }

        if (startMode.getHours() === endMode.getHours()) {
            endMode.setMinutes(endMode.getMinutes() - 30);
        }

        let options = [];
        while (startMode < endMode) {
            if (!bookingOpening) {
                startMode.setMinutes(startMode.getMinutes() + 30);
            }

            options.push({
                date: new Date(startMode),
                time: this.getTime(startMode),
                show: false,
                current: false,
                disable: false,
            } as IOption);

            bookingOpening = false;
        }

        return this.setOptionsRules(options, currentTime);
    }

    setOptionsRules = (options, currentTime?: Date, clearLimit: boolean = true): IOption[] => {
        let date = (currentTime || this.props.date).ovClone(),
            isToday: boolean = DateUtil.isEqualDate(this.props.date, this.today);

        // Если выбранный день не сегодняшний, обнуляем левый предел
        if (!isToday && clearLimit) {
            date.setHours(0);
            date.setMinutes(1);
        }

        date.setSeconds(0);

        let leftLimit = new Date(date.ovClone().setMinutes(date.getMinutes() - 1)),
            // rightLimit = new Date(DateUtil.clone(date).setMinutes(date.getMinutes() + 121)), // 2 часа
            showCount = 0;

        options.forEach((el, i) => {
            if (isToday && DateUtil.isBiggerTime(this.today, el.date) && DateUtil.isEqualDate(this.today, el.date)) {
                el.disabled = true;
            }

            if (DateUtil.isBiggerTime(el.date, leftLimit)) {
                // && DateUtil.isLessTime(el.date, rightLimit)
                el.show = showCount < 4;

                showCount++;
            } else {
                if (options.length - 4 <= i && showCount < 4) {
                    el.show = true;
                    showCount++;
                } else {
                    el.show = false;
                }
            }
        });

        return options;
    };

    setCurrentOption(options: IOption[]): IOption[] {
        let isMarkedCurrent: boolean = false;

        return options.map((option: IOption) => {
            if (option.show && !isMarkedCurrent) {
                option.current = true;
                isMarkedCurrent = true;

                this.props.onChange(this.getTime(option.date));
            }

            return option;
        });
    }

    toggle = (turn: boolean): void => {
        let options = this.state.options;

        if (turn) {
            options.forEach((el) => {
                el.show = true;
            });
        } else {
            options = this.setOptionsRules(options, this.state.currentTime);
        }

        this.setState((prevState) => ({
            ...prevState,
            options: options,
            isShow: turn,
        }));
    };

    choose = (chooseDate: Date): void => {
        let options = this.state.options;

        options.forEach((el) => {
            el.current = el.date === chooseDate;
        });

        if (this.state.isShow) {
            options = this.setOptionsRules(options, chooseDate, false);
        }

        this.props.onChange(this.getTime(chooseDate));

        this.setState((prevState) => ({
            ...prevState,
            options: options,
            currentTime: chooseDate,
            isShow: false,
        }));
    };

    getTime(dateTime: Date): string {
        return (
            (dateTime.getHours() === 0 ? '00' : dateTime.getHours().toString()) +
            ':' +
            (dateTime.getMinutes() === 0 ? '00' : dateTime.getMinutes().toString())
        );
    }

    render() {
        return (
            <div className="ov-form__switcher-container">
                {!this.state.hasAvailableOption && (
                    <div className="ov-form__message -time">
                        К сожалению, {this.state.date.ovFormat('d mmm')} забронировать столик нельзя, может в другой день?
                    </div>
                )}

                {this.state.hasAvailableOption && (
                    <>
                        <div
                            className={'ov-form__switcher' + (this.state.isShow ? ' -open' : '')}
                            onClick={() => this.toggle(!this.state.isShow)}
                        >
                            <div className="ov-form__switcher-label">Время бронирования</div>
                            <ArrowIcon className="ov-form__switcher-arrow" />
                        </div>
                        <ul className="ov-form__select -time -open">
                            {this.state.options.map((option, i) => {
                                return option.show ? (
                                    <li
                                        className={
                                            'ov-form__select-item' +
                                            (option.current ? ' -active' : '') +
                                            (option.disabled ? ' -disabled' : '')
                                        }
                                        onClick={() => this.choose(option.date)}
                                        key={i}
                                    >
                                        {option.time}
                                    </li>
                                ) : (
                                    ''
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        booking: state.booking,
    };
};

export default connect(mapStateToProps)(TimeChoose);
