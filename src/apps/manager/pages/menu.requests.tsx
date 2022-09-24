import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import { DataGrid } from '@mui/x-data-grid';
import { IMenuManagerState } from 'store/reducers/manager/menu';
import { MenuActions } from 'store/actions/manager/menu';
import { MenuRequest } from 'model/dto/menu.request';
import _ from 'lodash';
import { Customer } from 'model/dto/customer';
import Button from '@mui/material/Button/Button';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogPanel from 'apps/manager/components/dialog.actions';
import Request from 'apps/manager/components/request';

export const MenuRequestsPage = () => {
    const menuState: IMenuManagerState = useSelector((state: IRootState) => state.menuManager);
    const dispatch = useDispatch();
    const [requests, setRequests] = useState<MenuRequest[]>([]);
    const [page, setPage] = useState<number>(0);
    const [request, setRequest] = useState<MenuRequest>(null);

    useEffect(() => {
        document.title = 'Заявки на доставку | OVVY';
    }, []);

    // Загрузка заявок
    useEffect(() => {
        if (!menuState.requestsLoaded) {
            dispatch(MenuActions.getRequests(page));
        } else {
            setRequests(menuState.requests);
        }
    }, [menuState.requestsLoaded]);

    useEffect(() => {
        if (!menuState.requestsLoaded) {
            return;
        }

        dispatch(MenuActions.getRequests(page));
    }, [page]);

    const columns = [
        { field: 'id', headerName: 'Код', width: 100, sortable: true, renderCell: (params) => '#' + params.value },
        { field: 'date', headerName: 'Дата', width: 160, sortable: true, renderCell: (params) => params.value.toLocaleString() },
        {
            field: 'order',
            headerName: 'Заказ',
            sortable: false,
            minWidth: 300,
            flex: 1,
            renderCell: (params) => {
                const titles: string[] = _.map(params.value, (order) => order.name);
                return <>{titles.join(', ')}</>;
            },
        },
        {
            field: 'customer',
            headerName: 'Заказчик',
            sortable: false,
            minWidth: 300,
            flex: 1,
            renderCell: (params) => {
                const customer: Customer = params.value;

                return (
                    <div className="ov-button -default">
                        {customer.name},{' '}
                        <a className="ov-link" href={'tel:' + customer.phone}>
                            {customer.phone}
                        </a>
                    </div>
                );
            },
        },
        {
            field: 'info',
            headerName: '',
            width: 140,
            sortable: true,
            renderCell: (params) => (
                <div className="ov-table__control">
                    <Button variant="outlined" color="info" size="small" onClick={() => setRequest(params.row)}>
                        Подробнее
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <h1 className="ov-title">Заявки на доставку</h1>

            <DataGrid
                onPageChange={(newPage) => setPage(newPage)}
                className="ov-table"
                rows={requests}
                loading={!menuState.requestsLoaded}
                rowCount={menuState.count}
                autoHeight
                page={page}
                columns={columns}
                pageSize={15}
                paginationMode="server"
                pagination
                disableSelectionOnClick
            />

            {request && (
                <Dialog fullWidth maxWidth="sm" open={!!request} onClose={() => setRequest(null)}>
                    <DialogTitle className="ov-dialog__title">Заказ #{request.id}</DialogTitle>

                    <DialogContent className="ov-dialog__content">
                        <Request request={request} />
                    </DialogContent>
                    <DialogPanel
                        onCancel={() => {
                            setRequest(null);
                        }}
                    />
                </Dialog>
            )}
        </>
    );
};
