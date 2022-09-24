import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import { Offer } from 'model/dto/offer';
import { IOfferState } from 'store/reducers/manager/offer';
import { OfferActions } from 'store/actions/offer';
import { Card } from '../components/card';
import Image from '../../../components/shared/image';
import Button from '@mui/material/Button/Button';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import TextField from '@mui/material/TextField/TextField';
import { AppUtil } from 'utils/app.util';
import DialogPanel from 'apps/manager/components/dialog.actions';
import { FormControlLabel } from '@mui/material';
import Switch from '@mui/material/Switch/Switch';
import Chip from '@mui/material/Chip/Chip';
import _ from 'lodash';

export const OfferPage = () => {
    const offerState: IOfferState = useSelector((state: IRootState) => state.offer);
    const [editableItem, setEditableItem] = useState<Offer>(null);
    const [removingItem, setRemovingItem] = useState<Offer>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        document.title = 'Акции | OVVY';
    });

    useEffect(() => {
        if (!offerState.loaded) {
            dispatch(OfferActions.getByCredential());
        }
    }, []);

    const handleChange = (e): void => {
        const [name, value] = AppUtil.getNameValue(e);

        setEditableItem({ ...editableItem, [name]: value });
    };

    const saveItem = (e): void => {
        e.preventDefault();

        dispatch(OfferActions.save(editableItem));
        setEditableItem(null);
    };

    const removeItem = (): void => {
        dispatch(OfferActions.delete(removingItem));
        setRemovingItem(null);
    };

    return (
        <>
            <h1 className="ov-title">Акции</h1>

            <section className="ov-page__controls">
                <Button variant="contained" onClick={() => setEditableItem(new Offer())} color="primary">
                    Создать
                </Button>
            </section>

            {_.map(offerState.offer, (offer: Offer) => (
                <Card
                    id={offer.id}
                    key={offer.id}
                    title={offer.name}
                    description={offer.description}
                    image={offer.image}
                    editAction={() => setEditableItem(offer)}
                    deleteAction={() => setRemovingItem(offer)}
                    statusEl={
                        <>
                            {offer.showInSite ? (
                                <Chip label="Доступна на сайте" color="success" variant="outlined" />
                            ) : (
                                <Chip label="Недоступна на сайте" color="error" variant="outlined" />
                            )}
                            {offer.showInMenu ? (
                                <Chip label="Доступна в меню" color="success" variant="outlined" />
                            ) : (
                                <Chip label="Недоступна в меню" color="error" variant="outlined" />
                            )}
                        </>
                    }
                />
            ))}

            <Dialog fullWidth maxWidth="sm" open={!!editableItem || !!removingItem}>
                <DialogTitle className="ov-dialog__title">
                    {removingItem ? 'Удаление акции' : editableItem?.id ? 'Изменить акцию' : 'Создать акцию'}
                </DialogTitle>

                {editableItem && (
                    <form onSubmit={saveItem}>
                        <DialogContent className="ov-dialog__content">
                            {editableItem && (
                                <div className="ov-form">
                                    <div className="ov-form__row">
                                        <div className="ov-form__field -radio">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={editableItem.showInSite}
                                                        value={'switch'}
                                                        name={'showInSite'}
                                                        onChange={handleChange}
                                                    />
                                                }
                                                label={editableItem.showInSite ? 'Доступна на сайте' : 'Недоступна на сайте'}
                                            />
                                        </div>

                                        <div className="ov-form__field -radio">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={editableItem.showInMenu}
                                                        value={'switch'}
                                                        name={'showInMenu'}
                                                        onChange={handleChange}
                                                    />
                                                }
                                                label={editableItem.showInMenu ? 'Доступна в меню' : 'Недоступна в меню'}
                                            />
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="ov-form__row -nowrap">
                                        <div className="ov-form__field">
                                            <TextField
                                                name="name"
                                                label="Название"
                                                value={editableItem.name}
                                                autoComplete={'false'}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                            />
                                        </div>

                                        <div className="ov-form__field">
                                            <TextField
                                                fullWidth
                                                label="Сортировка"
                                                inputProps={{
                                                    step: 1,
                                                    min: 1,
                                                    max: 50,
                                                    type: 'number',
                                                }}
                                                value={editableItem.sort}
                                                name="sort"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="ov-form__row">
                                        <div className="ov-form__field -full">
                                            <TextField
                                                name="description"
                                                label="Описание"
                                                value={editableItem.description}
                                                onChange={handleChange}
                                                multiline
                                                rows={4}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Image item={editableItem} setItem={setEditableItem} />
                                </div>
                            )}
                        </DialogContent>
                        <DialogPanel
                            onSave={saveItem}
                            onCancel={() => {
                                setEditableItem(null);
                            }}
                        />
                    </form>
                )}

                {removingItem && (
                    <>
                        <DialogContent className="ov-dialog__content">
                            <div className="ov-dialog__text">
                                Подтвердите удаление акции <b>{removingItem.name}</b>
                            </div>
                        </DialogContent>
                        <DialogPanel onCancel={() => setRemovingItem(null)} onDelete={removeItem} />
                    </>
                )}
            </Dialog>
        </>
    );
};
