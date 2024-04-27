// services/authApi.ts
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

interface LoginResponse {
    token: string;
}

interface LoginRequest {
    username: string;
    password: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080/api/'}),
    tagTypes: ['User', 'Profile'],
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => {
                console.log('Logging in with:', credentials);
                return {
                    url: 'auth/login',
                    method: 'POST',
                    body: credentials,
                }
            },
            invalidatesTags: ['User', 'Profile'],
        }),
    }),
});

export const {useLoginMutation} = authApi;
