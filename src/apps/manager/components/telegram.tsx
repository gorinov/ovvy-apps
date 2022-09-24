import React, { useState } from 'react';
import { BookingApi } from 'services/api/booking.api';
import { BookingTypes } from 'store/reducers/booking';
import { useDispatch } from 'react-redux';
import Alert from '@mui/material/Alert/Alert';
import List from '@mui/material/List/List';
import _ from 'lodash';
import ListItem from '@mui/material/ListItem/ListItem';
import IconButton from '@mui/material/IconButton/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemAvatar from '@mui/material/ListItemAvatar/ListItemAvatar';
import Avatar from '@mui/material/Avatar/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import Loader from 'components/loader';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import Button from '@mui/material/Button/Button';
import Dialog from '@mui/material/Dialog/Dialog';
import { MenuApi } from 'services/api/menu.api';
import { MenuManagerTypes } from 'store/reducers/manager/menu';

export const Telegram = ({ id, usernameList, kind }) => {
    const [telegramDialog, setTelegramDialog] = useState(false);
    const [telegramChats, setTelegramChats] = useState(null);
    const dispatch = useDispatch();

    const openTelegramChats = (): void => {
        setTelegramDialog(true);
        setTelegramChats(null);

        if (kind === 'menu') {
            MenuApi.getTelegramChats(id).then((chats) => {
                setTelegramChats(chats);
            });
        } else {
            BookingApi.getTelegramChats(id).then((chats) => {
                setTelegramChats(chats);
            });
        }
    };

    const addTelegramChat = async (chat) => {
        if (kind === 'menu') {
            MenuApi.addTelegramChat({ id: id, ...chat }).then(() => {
                setTelegramDialog(false);
                dispatch({ type: MenuManagerTypes.MENU_MANAGER_SETTINGS_LOADING });
            });
        } else {
            BookingApi.addTelegramChat({ id: id, ...chat }).then(() => {
                setTelegramDialog(false);
                dispatch({ type: BookingTypes.BOOKING_SETTING_LOADING });
            });
        }
    };

    const removeTelegramChat = (username: string) => {
        if (!confirm('Подтвердите удаление')) {
            return;
        }

        if (kind === 'menu') {
            MenuApi.removeTelegramChat({ id: id, username: username }).then(() => {
                dispatch({ type: MenuManagerTypes.MENU_MANAGER_SETTINGS_LOADING });
            });
        } else {
            BookingApi.removeTelegramChat({ id: id, username: username }).then(() => {
                dispatch({ type: BookingTypes.BOOKING_SETTING_LOADING });
            });
        }
    };

    return (
        <>
            <Alert severity="info">
                {!id && <>Заполните и сохраните основные настройки, чтобы перейти к подключению уведомлений</>}
                {id && (
                    <>
                        {' '}
                        Для получения оповещений о бронированиях в Telegram, отправьте число "{id}" боту{' '}
                        <a className="ov-link -secondary" href="https://t.me/ovvybot" target="_blank">
                            OvvyBot
                        </a>
                        .
                        <br />
                        После этого выберите свой аккаунт в{' '}
                        <span className="ov-link -secondary" onClick={openTelegramChats}>
                            списке
                        </span>
                        .
                        <br />
                        Количество аккаунтов не ограничено.
                    </>
                )}
            </Alert>

            {usernameList?.length > 0 && (
                <div className="ov-list -compact">
                    <h4>Список привязанных аккаунтов</h4>
                    <List>
                        {_.map(usernameList, (username) => (
                            <ListItem
                                key={username}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => removeTelegramChat(username)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={username} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            )}

            <Dialog
                open={telegramDialog}
                onClose={() => {
                    setTelegramDialog(false);
                    setTelegramChats(null);
                }}
            >
                <DialogContent className="ov-dialog">
                    {telegramChats && !telegramChats.length && (
                        <Alert severity="info">
                            Не найдено ни одно сообщения с числом "{id}".
                            <br />
                            Попробуйте отправить ещё одно сообщение с числом "{id}".
                        </Alert>
                    )}

                    {!telegramChats && <Loader force={true} />}

                    {telegramChats?.length > 0 && (
                        <>
                            <DialogTitle>Выберите Ваш аккаунт в Telegram</DialogTitle>

                            <List>
                                {_.map(telegramChats, (chat) => (
                                    <ListItem button onClick={() => addTelegramChat(chat)} key={chat.username}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={chat.username} />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </DialogContent>

                {telegramChats && (
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setTelegramDialog(false);
                                setTelegramChats(null);
                            }}
                            color="primary"
                            autoFocus
                        >
                            Отменить
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    );
};

export default Telegram;
