import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Post {
    id: number;
    title: string;
    content: string;
    author: User;
    createdAt: string;
}

interface User {
    id: number;
    username: string;
}

export const postApi = createApi({
    reducerPath: 'postApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/' }),
    endpoints: (builder) => ({
        getPosts: builder.query<Post[], void>({
            query: () => 'posts',
        }),
        createPost: builder.mutation<Post, Partial<Post>>({
            query: (body) => ({
                url: 'posts',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useGetPostsQuery, useCreatePostMutation } = postApi;
