import React, { useState } from 'react';
import TextField from '@mui/material/TextField/TextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface PasswordProps {
    value: string;
    label?: string;
    name?: string;
    variant?: 'outlined' | 'standard' | 'filled';
    onChange: (e) => void;
}

export const PasswordField = (props: PasswordProps) => {
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisiblity = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <div className="ov-form__field-container">
            <TextField
                type={passwordShown ? 'text' : 'password'}
                name={props.name || 'password'}
                label={props.label || 'Пароль'}
                variant={props.variant || 'outlined'}
                required
                defaultValue={props.value || ''}
                onChange={props.onChange}
                fullWidth
            />

            <div
                title={passwordShown ? 'Скрыть' : 'Показать'}
                className="ov-form__field-icon -interactive"
                onClick={togglePasswordVisiblity}
            >
                {passwordShown ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </div>
        </div>
    );
};
