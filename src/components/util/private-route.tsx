import React, {Component} from 'react';
import {Redirect, Route} from "react-router";

export const PrivateRoute = ({component: Component, isAuth, ...rest}) => {
    return (
        <Route
            {...rest}
            render={(props) => isAuth === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/signin', state: {from: props.location}}}/>}
        />
    )
}