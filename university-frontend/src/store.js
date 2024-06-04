// store.ts
import {configureStore} from '@reduxjs/toolkit';
import {authApi} from './services/authApi';
import {apiService} from "./services/apiService";
import {postApi} from "./services/postApi";

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
        [postApi.reducerPath]: postApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            // .concat(loggerMiddleware)
            .concat(authApi.middleware)
            .concat(postApi.middleware)
            .concat(apiService.middleware),
});