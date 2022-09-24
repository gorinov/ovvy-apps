import React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';

export const Loader = ({ force = false }) => {
    const isLoading = useSelector((state: IRootState) => !state.app.loaded);

    return (
        <>
            {(force || isLoading) && (
                <div className="ov__loader">
                    <div className="ov__loader-container">
                        <svg viewBox="25 25 50 50">
                            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="3" strokeMiterlimit="10" />
                        </svg>
                    </div>
                </div>
            )}
        </>
    );
};

export default Loader;
