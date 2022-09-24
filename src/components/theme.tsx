import React from 'react';
import createTheme from '@mui/material/styles/createTheme';
import { ruRU as coreRuRU } from '@mui/material/locale';
import { ruRU } from '@mui/x-data-grid';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

const theme = createTheme(
    {
        palette: {
            success: {
                main: '#4CAF50',
            },
            primary: {
                main: '#F44336',
            },
            secondary: {
                main: '#30bced',
                contrastText: '#fff',
            },
        },
        components: {
            MuiTextField: {
                defaultProps: {
                    variant: 'outlined',
                },
            },
            MuiSelect: {
                defaultProps: {
                    variant: 'outlined',
                },
            },
            MuiSnackbar: {
                defaultProps: {
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center',
                    },
                },
            },
        },
    },
    ruRU,
    coreRuRU
);

const Theme = (props) => {
    return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default Theme;
