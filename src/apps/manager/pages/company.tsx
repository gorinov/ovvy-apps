import React, { useEffect } from 'react';
import CompanyForm, { CompanyFormMode } from '../../../components/form/company';

export const CompanyPage = () => {
    useEffect(() => {
        document.title = 'Заведение | OVVY';
    });

    return (
        <>
            <h1 className="ov-title">Заведение</h1>
            <CompanyForm mode={CompanyFormMode.Update} />
        </>
    );
};
