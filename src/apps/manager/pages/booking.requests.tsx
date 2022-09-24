import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';
import { BookingActions } from 'store/actions/booking';
import { IBookingState } from 'store/reducers/booking';
import { DataGrid } from '@mui/x-data-grid';
import { ExpandText } from 'components/util/expand-text';
import NotCompany from 'apps/manager/components/not-company';

export const BookingRequestsPage = () => {
    const bookingState: IBookingState = useSelector((state: IRootState) => state.booking);
    const dispatch = useDispatch();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        document.title = 'Заявки | OVVY';
    }, []);

    // Загрузка заявок
    useEffect(() => {
        if (!bookingState.requestsLoaded) {
            dispatch(BookingActions.getRequests());
        } else {
            setRequests(bookingState.requests);
        }
    }, [bookingState.requestsLoaded]);

    const columns = [
        { field: 'id', headerName: 'Код', width: 100, sortable: true, renderCell: (params) => '#' + params.value },
        { field: 'date', headerName: 'Дата', width: 160, sortable: true, renderCell: (params) => params.value.ovFormat('d mmm yyyy') },
        { field: 'time', headerName: 'Время', width: 100, sortable: false },
        { field: 'name', headerName: 'Имя', width: 200, sortable: true },
        { field: 'guests', headerName: 'Количество гостей', width: 180, sortable: false },
        { field: 'phone', headerName: 'Телефон', width: 140, sortable: false },
        {
            field: 'wish',
            headerName: 'Пожелание',
            width: 300,
            renderCell: (params) => <ExpandText value={params.value ? params.value.toString() : ''} width={params.colDef.width} />,
        },
        { field: 'createdDate', headerName: 'Создано', width: 200, sortable: true, renderCell: (params) => params.value.toLocaleString() },
    ];

    const template = () => (
        <DataGrid className="ov-table" rows={requests} autoHeight columns={columns} pageSize={10} disableSelectionOnClick />
    );

    return (
        <>
            <h1 className="ov-title">Заявки</h1>

            {bookingState.requestsLoaded && (bookingState.requests ? template() : <NotCompany />)}
        </>
    );
};
