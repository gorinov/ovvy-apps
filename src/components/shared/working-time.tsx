import React from 'react';
import { DateUtil, IWorkingTime } from 'utils/date';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField/TextField';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Switch from '@mui/material/Switch/Switch';

export const WorkingTime = ({ workingTime, update }) => {
    const defaultWorkingTime: IWorkingTime = DateUtil.generateTime();

    const updateOpen = (day: string, time: string): void => {
        workingTime[day].open = time;
        update(day, workingTime[day]);
    };

    const updateClose = (day: string, time: string): void => {
        workingTime[day].close = time;
        update(day, workingTime[day]);
    };

    const updateIsWorking = (day: string, isWorking: boolean): void => {
        if (!isWorking) {
            updateOpen(day, null);
            updateClose(day, null);
        } else {
            updateOpen(day, defaultWorkingTime[day].open);
            updateClose(day, defaultWorkingTime[day].close);
        }

        workingTime[day].isWorking = isWorking;
        update(day, workingTime[day]);
    };

    const updateIsAround = (day: string, isAround: boolean): void => {
        if (isAround) {
            updateOpen(day, '00:00');
            updateClose(day, '00:00');
        } else {
            updateOpen(day, defaultWorkingTime[day].open);
            updateClose(day, defaultWorkingTime[day].close);
        }

        update(day, workingTime[day]);
    };

    const getMask = (time) => {
        return [/[0-2]/, time[0] === '2' ? /[0-3]/ : /[0-9]/, ':', /[0-5]/, /[0-9]/];
    };

    return (
        <>
            <div className={'ov-form__working'}>
                {Object.keys(defaultWorkingTime).map((day: string) => {
                    let timeOpen: string = workingTime[day].open;
                    let timeClose: string = workingTime[day].close;
                    let isWorking: boolean = workingTime[day].isWorking;
                    let isAround: boolean = timeOpen === timeClose;

                    return (
                        <div className={'ov-form__working-day'} key={day}>
                            <div className={'ov-form__working-label'}>{defaultWorkingTime[day].label}</div>

                            <div className={'ov-form__working-wrapper'}>
                                {isWorking && !isAround && (
                                    <div className={'ov-form__working-time-wrapper'}>
                                        <InputMask
                                            mask={getMask(timeOpen)}
                                            value={timeOpen}
                                            onChange={(e) => updateOpen(day, e.target.value)}
                                        >
                                            <TextField className={'ov-form__working-time'} fullWidth required />
                                        </InputMask>

                                        <div className={'ov-form__working-delimiter'}>—</div>

                                        <InputMask
                                            mask={getMask(timeClose)}
                                            value={timeClose}
                                            onChange={(e) => updateClose(day, e.target.value)}
                                        >
                                            <TextField className={'ov-form__working-time'} fullWidth required />
                                        </InputMask>
                                    </div>
                                )}

                                <div className={'ov-form__working-control-wrapper'}>
                                    <FormControlLabel
                                        control={<Switch checked={!isWorking} onChange={() => updateIsWorking(day, !isWorking)} />}
                                        label={'Выходной'}
                                    />

                                    {isWorking && (
                                        <FormControlLabel
                                            control={<Switch checked={isAround} onChange={() => updateIsAround(day, !isAround)} />}
                                            label="Круглосуточно"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default WorkingTime;
