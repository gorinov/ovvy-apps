import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import '../../styles/create-company-form/main.scss';
import { useSelector } from 'react-redux';
import AlertTitle from '@mui/material/AlertTitle/AlertTitle';
import Alert from '@mui/material/Alert/Alert';
import { default as CompanyForm, CompanyFormMode } from '../../components/form/company';
import { IRootState } from 'store/reducers';
import Theme from '../../components/theme';

function CreateCompanyFormApp() {
    const email = useSelector((state: IRootState) => state.company.company?.email);

    return (
        <div className="ov -create-company-form">
            <Theme>
                <Routes>
                    <Route
                        path="/success"
                        element={
                            <Alert severity="success">
                                <AlertTitle> Заведение добавлено!</AlertTitle>
                                Оно появится на сайте после модерации. Спасибо!{' '}
                                {email ? `На эл. почту ${email} мы отправим доступ к личному кабинету` : ''}
                            </Alert>
                        }
                    />
                    <Route path="/" element={<CompanyForm mode={CompanyFormMode.CreatePortal} />} />
                </Routes>
            </Theme>
        </div>
    );
}

export default CreateCompanyFormApp;
