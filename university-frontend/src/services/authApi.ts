// services/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface LoginResponse {
    token: string;
}

interface LoginRequest {
    username: string;
    password: string;
}

export const authApi = createApi({
    reducerPath: 'apiService',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/' }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, { username: string; password: string }>({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginMutation } = authApi;
