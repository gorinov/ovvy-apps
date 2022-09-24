import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import IconButton from '@mui/material/IconButton/IconButton';
import Chip from '@mui/material/Chip/Chip';
import _ from 'lodash';
import Button from '@mui/material/Button/Button';

type CardEmptyProps = {
    text: string;
    createAction?: () => void;
};

export const CardEmpty = (props: CardEmptyProps) => {
    return (
        <div className="ov-card -empty">
            <div className="ov-card__text">{props.text}</div>
            {props.createAction && (
                <div className="ov-card__action">
                    <Button variant="outlined" onClick={props.createAction} color="primary">
                        Добавить
                    </Button>
                </div>
            )}
        </div>
    );
};
