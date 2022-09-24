import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import { default as feedback, IFeedbackState } from 'store/reducers/manager/feedback';
import { FeedbackActions } from 'store/actions/feedback';
import { Feedback } from 'model/dto/feedback';
import { ExpandText } from 'components/util/expand-text';
import Rating from '@mui/material/Rating/Rating';
import Button from '@mui/material/Button/Button';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import TextField from '@mui/material/TextField/TextField';
import { DataGrid } from '@mui/x-data-grid';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DialogPanel from 'apps/manager/components/dialog.actions';
import NotCompany from 'apps/manager/components/not-company';

export const FeedbackPage = () => {
    const feedbackState: IFeedbackState = useSelector((state: IRootState) => state.feedback);
    const [editableFeedback, setEditableFeedback] = useState<Feedback>(null);
    const dispatch = useDispatch();

    const columns = [
        {
            field: 'unreliable',
            headerName: 'Достоверен',
            description: 'Если несколько пользователей проголосуют за то, что отзыв недостоверный, он будет помечен',
            width: 130,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div className="ov-table__icon-container">
                    {params.value ? (
                        <ThumbDownIcon className="ov-table__icon -unapprove" />
                    ) : (
                        <ThumbUpIcon className="ov-table__icon -approve" />
                    )}
                </div>
            ),
        },
        { field: 'date', headerName: 'Дата', width: 140, sortable: true },
        { field: 'author', headerName: 'Автор', width: 100, sortable: false },
        {
            field: 'feedback',
            headerName: 'Отзыв',
            width: 300,
            sortable: false,
            renderCell: (params) => <ExpandText value={params.value ? params.value.toString() : ''} width={params.colDef.width} />,
        },
        {
            field: 'rating',
            headerName: 'Оценка',
            width: 140,
            sortable: true,
            renderCell: (params) => <Rating readOnly value={params.value} />,
        },
        {
            field: 'answer',
            headerName: 'Ответ',
            width: 300,
            filterable: false,
            renderCell: (params) => <ExpandText value={params.value ? params.value.toString() : ''} width={params.colDef.width} />,
        },
        {
            field: 'action',
            headerName: 'Действия',
            width: 170,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                return (
                    <div className="ov-table__control">
                        <Button variant="outlined" color="info" size="small" onClick={() => setEditableFeedback(params.row)}>
                            {params.value ? 'Изменить ответ' : 'Ответить'}
                        </Button>
                    </div>
                );
            },
        },
    ];
    let rows = [];

    useEffect(() => {
        document.title = 'Отзывы | OVVY';
    });

    // Загрузка отзывов
    useEffect(() => {
        if (!feedbackState.loaded) {
            dispatch(FeedbackActions.getAll());
        }
    }, []);

    if (feedbackState.feedback?.length > 0) {
        rows = feedbackState.feedback.map((feedback: Feedback) => {
            return {
                id: feedback.id,
                status: feedback.answer ? 'Отвечено' : 'Без ответа',
                feedback: feedback.comment,
                date: feedback.date.toLocaleString('ru', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                author: feedback.author,
                rating: feedback.rating,
                unreliable: feedback.unreliableCount > 5,
                answer: feedback.answer,
                action: feedback.answer,
            };
        });
    }

    const changeItem = (answer: string): void => {
        setEditableFeedback({ ...editableFeedback, answer: answer });
    };

    const saveItem = (e): void => {
        e.preventDefault();

        dispatch(FeedbackActions.setAnswer(editableFeedback));
        setEditableFeedback(null);
    };

    const template = () => (
        <>
            <DataGrid className="ov-table" rows={rows} autoHeight columns={columns} pageSize={10} disableSelectionOnClick />
            <Dialog fullWidth maxWidth="sm" open={!!editableFeedback} onClose={() => setEditableFeedback(null)}>
                <DialogTitle className="ov-dialog__title">Ответ на отзыв</DialogTitle>
                <form onSubmit={saveItem}>
                    <DialogContent className="ov-dialog__content">
                        {editableFeedback && (
                            <TextField
                                name="description"
                                label="Ответ"
                                value={editableFeedback.answer}
                                onChange={(e) => changeItem(e.target.value)}
                                multiline
                                rows={4}
                                fullWidth
                            />
                        )}
                    </DialogContent>
                    <DialogPanel
                        onSave={saveItem}
                        onCancel={() => {
                            setEditableFeedback(null);
                        }}
                    />
                </form>
            </Dialog>
        </>
    );

    return (
        <>
            <h1 className="ov-title">Отзывы</h1>
            {feedbackState.loaded && (feedbackState.feedback ? template() : <NotCompany />)}
        </>
    );
};
