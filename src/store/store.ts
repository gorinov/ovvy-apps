import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { Environment, getEnv } from 'utils/env';

export default createStore(
    rootReducer,
    {},
    compose(
        applyMiddleware(thunk),
        getEnv() === Environment.Development && (window as any).__REDUX_DEVTOOLS_EXTENSION__
            ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
            : (f) => f
    )
);
