// src/services/apiService.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    university: string;
    graduationYear: number;
    bio: string;
    user: {
        id: number;
        username: string;
    };
}

interface User {
    id: number;
    username: string;
    email: string;

}

interface Job {
    id: number;
    title: string;
    description: string;
    postedBy: number;
    // Другие свойства
}

export const apiService = createApi({
    reducerPath: 'apiService',
    tagTypes: ['Profile'], // Указываем, какие типы тегов мы используем
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/',
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('token');
            console.log("Token for API:", token);
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getProfileByUsername: builder.query<Profile, string>({
            query: (username) => `profiles/${username}`,
        }),
        createProfile: builder.mutation<Profile, Profile>({
            query: (profile) => ({
                url: 'profiles',
                method: 'POST',
                body: profile,
            }),
            invalidatesTags: [{ type: 'Profile', id: 'LIST' }]
        }),
        updateProfile: builder.mutation<Profile, { id: number; profile: Profile }>({
            query: ({ id, profile }) => ({
                url: `profiles/${id}`,
                method: 'PUT',
                body: profile,
            }),
        }),
        getUsers: builder.query<User[], void>({
            query: () => 'users',
        }),
        getJobs: builder.query<Job[], void>({
            query: () => 'jobs',
        }),
    }),
});

export const { useGetUsersQuery, useGetProfileByUsernameQuery, useCreateProfileMutation, useUpdateProfileMutation, useGetJobsQuery } = apiService;
