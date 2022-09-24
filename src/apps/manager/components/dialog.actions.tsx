import React from 'react';
import Button from '@mui/material/Button/Button';
import DialogActions from '@mui/material/DialogActions/DialogActions';

export const DialogPanel = ({
    onCancel,
    onSave,
    onDelete,
}: {
    onCancel: () => any;
    onSave?: (e: any) => any;
    onDelete?: (e: any) => any;
}) => {
    return (
        <DialogActions className="ov-dialog__panel">
            <Button onClick={onCancel} color="primary" autoFocus>
                Закрыть
            </Button>

            {onSave && (
                <Button type="submit" color="primary" variant="contained">
                    Сохранить
                </Button>
            )}

            {onDelete && (
                <Button onClick={onDelete} color="primary" variant="contained">
                    Удалить
                </Button>
            )}
        </DialogActions>
    );
};

export default DialogPanel;
