import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import Switch from '@mui/material/Switch/Switch';
import { MenuActions } from 'store/actions/manager/menu';
import { IMenuManagerState } from 'store/reducers/manager/menu';
import { MenuSettings } from 'model/dto/menu.settings';
import Chip from '@mui/material/Chip/Chip';
import { MenuCategory } from 'model/dto/menu.category';
import _ from 'lodash';
import {
    IconButton,
    MenuItem as MenuItemSelect,
    FormControl,
    InputLabel,
    Select,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AppUtil } from 'utils/app.util';
import { MenuItem } from 'model/dto/menu.item';
import { Card } from 'apps/manager/components/card';
import Image from 'components/shared/image';
import { CardEmpty } from 'apps/manager/components/card.empty';
import { WeightUnit, weightUnitNames } from 'model/enum/core';
import DialogPanel from 'apps/manager/components/dialog.actions';
import Menu from '@mui/material/Menu/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router';

export const MenuPage = () => {
    const menuState: IMenuManagerState = useSelector((state: IRootState) => state.menuManager);
    const [editableCategory, setEditableCategory] = useState<MenuCategory>(null);
    const [removingCategory, setRemovingCategory] = useState<MenuCategory>(null);
    const [editableItem, setEditableItem] = useState<MenuItem>(null);
    const [removingItem, setRemovingItem] = useState<MenuItem>(null);
    const settings = menuState.settings || new MenuSettings();
    const [activeCategoryId, setActiveCategoryId] = useState<number>(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChangeCategory = (e) => AppUtil.handleChange(e, setEditableCategory);
    const handleChangeItem = (e) => AppUtil.handleChange(e, setEditableItem);
    const items: MenuItem[] = _.filter(settings.items, (item: MenuItem) => {
        if (activeCategoryId === 0) {
            return !item.categoryId;
        }

        if (activeCategoryId) {
            return item.categoryId === activeCategoryId;
        }

        return item.categoryId === _.first(settings.categories).id;
    });

    const getCategoryById = (id: number) => {
        return _.find(settings.categories, (category) => category.id === id);
    };

    useEffect(() => {
        document.title = '?????????????????? ?????????????? ?? ?????????????????? ???????? | OVVY';
    }, []);

    useEffect(() => {
        if (!menuState.settingsLoaded) {
            dispatch(MenuActions.getSettings());
        } else {
            if (!menuState.settings.id) {
                navigate('/menu/settings');

                AppUtil.showErrorSnackbar('?????????????????? ???????????????? ??????????????????, ?????????? ?????????????? ?? ???????????????? ????????');
            }
        }
    }, [menuState.settingsLoaded]);

    const saveCategory = (e): void => {
        e.preventDefault();
        dispatch(MenuActions.saveCategory(editableCategory, () => setEditableCategory(null)));
    };

    const saveItem = (e): void => {
        e.preventDefault();
        dispatch(MenuActions.saveItem(editableItem, () => setEditableItem(null)));
    };

    const removeItem = (): void => {
        dispatch(MenuActions.deleteItem(removingItem, () => setRemovingItem(null)));
    };

    const removeCategory = (): void => {
        dispatch(MenuActions.deleteCategory(removingCategory, () => setRemovingCategory(null)));
    };

    return (
        <>
            <h1 className="ov-title">????????</h1>

            <div className="ov-menu">
                <div className="ov-menu__categories">
                    <div className="ov-menu__header">
                        <h2>??????????????????</h2>

                        <div>
                            <IconButton color="default" onClick={() => setEditableCategory(new MenuCategory(menuState.settings.id))}>
                                <AddIcon />
                            </IconButton>
                        </div>
                    </div>

                    <div className="ov-menu__categories-list">
                        {_.map(settings.categories, (category: MenuCategory) => (
                            <div
                                className={
                                    'ov-menu__category' +
                                    (category.id === (_.isNull(activeCategoryId) ? _.first(settings.categories).id : activeCategoryId)
                                        ? ' -active'
                                        : '')
                                }
                                key={category.id}
                                onClick={() => setActiveCategoryId(category.id)}
                            >
                                <div className={'ov-menu__category-header' + (category.isDefault ? ' -wrap' : '')}>
                                    <div className="ov-menu__category-name">{category.name}</div>

                                    {category.description && <div className="ov-menu__category-label">{category.description}</div>}

                                    {!category.isDefault && (
                                        <IconButton
                                            className="ov-menu__category-control"
                                            onClick={(e) =>
                                                setAnchorEl({
                                                    id: category.id,
                                                    el: e.currentTarget,
                                                })
                                            }
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    )}

                                    <Menu anchorEl={anchorEl?.el} open={category.id === anchorEl?.id} onClose={() => setAnchorEl(null)}>
                                        <MenuItemSelect
                                            onClick={() => {
                                                setEditableCategory(category);
                                                setAnchorEl(null);
                                            }}
                                        >
                                            ????????????????
                                        </MenuItemSelect>
                                        <MenuItemSelect
                                            onClick={() => {
                                                setRemovingCategory(category);
                                                setAnchorEl(null);
                                            }}
                                        >
                                            ??????????????
                                        </MenuItemSelect>
                                    </Menu>
                                </div>

                                <div className="ov-menu__category-content">
                                    <Chip label={'??????????????: ' + category.count} variant="outlined" />
                                    {!category.isDefault &&
                                        (category.enabled ? (
                                            <Chip label="???????????????? ????????????" color="success" variant="outlined" />
                                        ) : (
                                            <Chip label="???????????????????? ????????????" color="error" variant="outlined" />
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="ov-menu__items">
                    <div className="ov-menu__header">
                        <h2>??????????????</h2>

                        <div>
                            <IconButton color="default" onClick={() => setEditableItem(new MenuItem(menuState.settings.id))}>
                                <AddIcon />
                            </IconButton>
                        </div>
                    </div>

                    {items.length === 0 && activeCategoryId != null && (
                        <CardEmpty
                            text={`?????????????? ?? ?????????????????? "${getCategoryById(activeCategoryId)?.name || '??????????????????'}" ?????? ??????`}
                            createAction={() => setEditableItem(new MenuItem(menuState.settings.id))}
                        />
                    )}
                    {items.length > 0 &&
                        _.map(items, (item: MenuItem) => {
                            let note: string = item.weight ? item.weight + ' ' + weightUnitNames[item.weightUnit] : '';
                            if (item.calories) {
                                note += ' (' + item.calories + ' ????????)';
                            }

                            return (
                                <Card
                                    id={item.id}
                                    key={item.id}
                                    title={item.name}
                                    description={item.description}
                                    image={item.image}
                                    note={note}
                                    enabled={item.enabled}
                                    priceBeforeDiscount={item.priceBeforeDiscount}
                                    priceAfterDiscount={item.priceAfterDiscount}
                                    statusEl={
                                        item.enabled ? (
                                            <Chip label="???????????????? ????????????" color="success" variant="outlined" />
                                        ) : (
                                            <Chip label="???????????????????? ????????????" color="error" variant="outlined" />
                                        )
                                    }
                                    editAction={() => setEditableItem(item)}
                                    deleteAction={() => {
                                        setRemovingItem(item);
                                    }}
                                />
                            );
                        })}
                </div>
            </div>

            <Dialog fullWidth maxWidth="sm" open={!!editableCategory || !!removingCategory}>
                <DialogTitle className="ov-dialog__title">
                    {removingCategory ? '?????????????? ??????????????????' : editableCategory?.id ? '???????????????? ??????????????????' : '?????????????? ??????????????????'}
                </DialogTitle>

                {editableCategory && (
                    <form onSubmit={saveCategory}>
                        <DialogContent>
                            <div className="ov-form__row">
                                <div className="ov-form__field -full">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={editableCategory.enabled}
                                                value={'switch'}
                                                name={'enabled'}
                                                onChange={handleChangeCategory}
                                            />
                                        }
                                        label={editableCategory.enabled ? '???????????????? ????????????' : '???????????????????? ????????????'}
                                    />
                                </div>
                            </div>

                            <div className="ov-form__row -nowrpap">
                                <div className="ov-form__field -full">
                                    <TextField
                                        name="name"
                                        type="text"
                                        label="????????????????"
                                        value={editableCategory.name}
                                        onChange={handleChangeCategory}
                                        fullWidth
                                    />
                                </div>

                                <div className="ov-form__field">
                                    <TextField
                                        fullWidth
                                        label="????????????????????"
                                        inputProps={{
                                            step: 1,
                                            min: 1,
                                            max: 50,
                                            type: 'number',
                                        }}
                                        value={editableCategory.sort}
                                        name={'sort'}
                                        onChange={handleChangeCategory}
                                    />
                                </div>
                            </div>
                        </DialogContent>

                        <DialogPanel
                            onSave={saveCategory}
                            onCancel={() => {
                                setEditableCategory(null);
                            }}
                            onDelete={null}
                        />
                    </form>
                )}

                {removingCategory && (
                    <>
                        <DialogContent>
                            <div className="ov-dialog__text">
                                ?????????????????????? ???????????????? ?????????????????? <b>{removingCategory.name}</b>
                            </div>
                        </DialogContent>
                        <DialogPanel onCancel={() => setRemovingCategory(null)} onDelete={removeCategory} />
                    </>
                )}
            </Dialog>

            <Dialog className="ov-dialog" fullWidth maxWidth="sm" open={!!editableItem || !!removingItem}>
                <>
                    <DialogTitle className="ov-dialog__title">
                        {removingItem ? '?????????????? ??????????????' : editableItem?.id ? '???????????????? ??????????????' : '?????????????? ??????????????'}
                    </DialogTitle>

                    {!!editableItem && (
                        <form onSubmit={saveItem}>
                            <DialogContent>
                                <div className="ov-form__row -nowrap">
                                    <div className="ov-form__field -full">
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={editableItem.enabled}
                                                    value={'switch'}
                                                    name={'enabled'}
                                                    onChange={handleChangeItem}
                                                />
                                            }
                                            label={editableItem.enabled ? '???????????????? ????????????' : '???????????????????? ????????????'}
                                        />
                                    </div>
                                </div>

                                <div className="ov-form__row -nowrap">
                                    <div className="ov-form__field">
                                        <TextField
                                            name="name"
                                            type="text"
                                            label="????????????????"
                                            value={editableItem.name}
                                            onChange={handleChangeItem}
                                            fullWidth
                                            required
                                        />
                                    </div>

                                    <div className="ov-form__field">
                                        <FormControl fullWidth>
                                            <InputLabel id="categoryId">??????????????????</InputLabel>
                                            <Select
                                                labelId="categoryId"
                                                label="??????????????????"
                                                name="categoryId"
                                                required
                                                value={editableItem.categoryId}
                                                onChange={handleChangeItem}
                                            >
                                                {settings.categories.map((category: MenuCategory) => (
                                                    <MenuItemSelect key={category.id} value={category.id}>
                                                        {category.name}
                                                    </MenuItemSelect>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className="ov-form__field">
                                        <TextField
                                            fullWidth
                                            label="????????????????????"
                                            inputProps={{
                                                step: 1,
                                                min: 1,
                                                max: 50,
                                                type: 'number',
                                            }}
                                            value={editableItem.sort}
                                            name="sort"
                                            onChange={handleChangeItem}
                                        />
                                    </div>
                                </div>

                                <div className="ov-form__row">
                                    <div className="ov-form__field -full">
                                        <TextField
                                            name="description"
                                            label="????????????/????????????????"
                                            value={editableItem.description}
                                            onChange={handleChangeItem}
                                            multiline
                                            rows={4}
                                            fullWidth
                                        />
                                    </div>
                                </div>

                                <div className="ov-form__row -nowrap">
                                    <div className="ov-form__field">
                                        <TextField
                                            name="priceBeforeDiscount"
                                            type="number"
                                            label="????????"
                                            required
                                            value={editableItem.priceBeforeDiscount}
                                            onChange={handleChangeItem}
                                            fullWidth
                                        />
                                    </div>

                                    <div className="ov-form__field">
                                        <TextField
                                            name="priceAfterDiscount"
                                            type="number"
                                            label="???????? ???? ??????????????"
                                            value={editableItem.priceAfterDiscount}
                                            onChange={handleChangeItem}
                                            fullWidth
                                            helperText="??????????????????, ???????? ???????????? ???????????????? ???????????????? ??????????"
                                        />
                                    </div>
                                </div>

                                <div className="ov-form__row -nowrap">
                                    <div className="ov-form__field">
                                        <TextField
                                            name="weight"
                                            type="number"
                                            label="?????? (??????????)"
                                            value={editableItem.weight}
                                            onChange={handleChangeItem}
                                            fullWidth
                                            required
                                        />
                                    </div>

                                    <div className="ov-form__field">
                                        <FormControl fullWidth>
                                            <InputLabel id="weightUnit">????. ??????????????????</InputLabel>
                                            <Select
                                                labelId="weightUnit"
                                                name="weightUnit"
                                                label="????. ??????????????????"
                                                value={editableItem.weightUnit}
                                                onChange={handleChangeItem}
                                                required
                                            >
                                                {_.map(_.filter(_.values(WeightUnit), _.isNumber), (value) => (
                                                    <MenuItemSelect key={value} value={value}>
                                                        {weightUnitNames[value]}
                                                    </MenuItemSelect>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className="ov-form__field">
                                        <TextField
                                            name="calories"
                                            type="number"
                                            label="???????????????????????? (????????)"
                                            value={editableItem.calories}
                                            onChange={handleChangeItem}
                                            fullWidth
                                        />
                                    </div>
                                </div>

                                <Image item={editableItem} setItem={setEditableItem} />
                            </DialogContent>
                            <DialogPanel onSave={saveItem} onCancel={() => setEditableItem(null)} />
                        </form>
                    )}

                    {removingItem && (
                        <>
                            <DialogContent>
                                <div className="ov-dialog__text">
                                    ?????????????????????? ???????????????? ?????????????? <b>{removingItem.name}</b>
                                </div>
                            </DialogContent>
                            <DialogPanel onCancel={() => setRemovingItem(null)} onDelete={removeItem} />
                        </>
                    )}
                </>
            </Dialog>
        </>
    );
};
