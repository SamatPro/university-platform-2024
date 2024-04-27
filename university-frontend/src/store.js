// store.ts
import {configureStore} from '@reduxjs/toolkit';
import {authApi} from './services/authApi';
import {apiService} from "./services/apiService";

const loggerMiddleware = store => next => action => {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
};

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [apiService.reducerPath]: apiService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            // .concat(loggerMiddleware)
            .concat(authApi.middleware)
            .concat(apiService.middleware),
});