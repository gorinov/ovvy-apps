import React, { useEffect } from 'react';
import CompanyForm, { CompanyFormMode } from '../../../components/form/company';

export const CompanyCreatePage = () => {
    useEffect(() => {
        document.title = 'Создание заведения | OVVY';
    });

    return (
        <>
            <h1 className="ov-title">Создание заведения</h1>
            <CompanyForm mode={CompanyFormMode.Create} />
        </>
    );
};
