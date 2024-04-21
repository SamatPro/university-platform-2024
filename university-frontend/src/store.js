// store.ts
import {configureStore} from '@reduxjs/toolkit';
import {authApi} from './services/authApi';
import {apiService} from "./services/apiService";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [apiService.reducerPath]: apiService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware).concat(apiService.middleware),
});

// const reducer = (state = { count: 0 }, action) => {
//     switch (action.type) {
//         case 'INCREMENT':
//             return { count: state.count + 1 };
//         default:
//             return state;
//     }
// };

export default store;