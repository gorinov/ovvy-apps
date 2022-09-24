import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {IRootState} from "../../store/reducers";
import {BookingSettings} from "../../model/dto/booking.settings";
import ArrowIcon from 'images/icons/arrow.svg';
import {BookingUtil} from "../../utils/booking.util";
import {TimeOption} from "../../model/booking";

export const BookingTime = ({ date, onChange }: { date: Date, onChange: (time: string) => void}) => {
    const settings: BookingSettings = useSelector((state: IRootState) => state.booking.settings);
    const [state, setState] = useState({
        date: date,
        currentDateTime: new Date(),
        selectedDateTime: null,
        isExpand: false,
        options: [],
        hasAvailableOption: true
    });

    useEffect(() => {
        setState((state) => {
            const options = BookingUtil.getTimeOptions(date, settings);

            onChange(options.find(option => option.selected).time);

            return {
                ...state,
                date: date,
                selectedDateTime: null,
                isExpand: false,
                options: options
            }
        })
    }, [date]);

    const select = (option: TimeOption) => {
        setState((state) => {
            if (state.isExpand) {
                state.options = BookingUtil.resolveVisibleOptions(state.options, state.date, option.dateTime, false);
            } else {
                state.options = BookingUtil.setSelectDate(state.options, option.dateTime);
            }

            onChange(option.time);

            return {
                ...state,
                options: state.options,
                isExpand: false,
                selectedDateTime: option.dateTime
            }
        });
    };

    const toggle = () => {
        setState((state) => {
            return {
                ...state,
                options: BookingUtil.resolveVisibleOptions(state.options, state.date, state.selectedDateTime, !state.isExpand),
                isExpand: !state.isExpand
            }
        })
    };

    const hasAvailableOption: boolean = BookingUtil.hasAvailableOption(state.options, state.date);

    return (
        <div className="ov-form__switcher-container">
            { !hasAvailableOption &&
            <div className="ov-form__message -time">
                К сожалению, {state.date.ovFormat('d mmm')} забронировать столик нельзя, может в другой день?
            </div>
            }

            { hasAvailableOption &&
            <>
                <div className={"ov-form__switcher" + (state.isExpand ? ' -open' : '')} onClick={() => toggle()}>
                    <div className="ov-form__switcher-label">Время бронирования</div>
                    <ArrowIcon className="ov-form__switcher-arrow"/>
                </div>
                <ul className="ov-form__select -time -open">
                    {
                        state.options.map((option: TimeOption, i) =>
                            option.visible && <li
                                className={"ov-form__select-item" + (option.selected ? ' -active' : '') + (option.disabled ? ' -disabled' : '')}
                                onClick={() => select(option)}
                                key={i}>
                                {option.time}
                            </li>
                        )
                    }
                </ul>
            </>
            }
        </div>
    );
}