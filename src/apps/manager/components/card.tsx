import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import IconButton from '@mui/material/IconButton/IconButton';
import Price from 'components/price';

type CardProps = {
    id: number;
    title: string;
    description: string;
    note?: string;
    enabled?: boolean;
    image?: string;
    date?: Date;
    statusEl?: any;
    editAction?: (id: number) => void;
    deleteAction?: (id: number) => void;
    priceAfterDiscount?: number;
    priceBeforeDiscount?: number;
};

export const Card = (props: CardProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    return (
        <div className="ov-card">
            <div className="ov-card__main">
                {!!props.image && (
                    <div className="ov-card__image">
                        <img src={props.image} />
                    </div>
                )}

                <div className="ov-card__info">
                    <div className="ov-card__header">
                        <div className="ov-card__title">
                            <h3>{props.title}</h3>

                            {props.statusEl && <div className="ov-card__status">{props.statusEl}</div>}
                        </div>

                        <IconButton className="ov-card__control" onClick={handleClick}>
                            <MoreVertIcon />
                        </IconButton>

                        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
                            {props.editAction && (
                                <MenuItem
                                    onClick={() => {
                                        handleClose();
                                        props.editAction?.(props.id);
                                    }}
                                >
                                    Изменить
                                </MenuItem>
                            )}

                            {props.deleteAction && (
                                <MenuItem
                                    onClick={() => {
                                        handleClose();
                                        props.deleteAction?.(props.id);
                                    }}
                                >
                                    Удалить
                                </MenuItem>
                            )}
                        </Menu>
                    </div>

                    {props.date && (
                        <div className="ov-card__date">
                            {props.date.toLocaleString('ru', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </div>
                    )}

                    {props.description && <div className="ov-card__description">{props.description}</div>}

                    <div className="ov-card__panel">
                        <div className="ov-card__note">{props.note}</div>

                        {!!props.priceBeforeDiscount && (
                            <Price
                                priceAfterDiscount={props.priceAfterDiscount}
                                priceBeforeDiscount={props.priceBeforeDiscount}
                                currency={'₽'}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
