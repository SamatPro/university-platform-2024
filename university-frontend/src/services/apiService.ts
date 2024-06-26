// apiService.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    university: string;
    graduationYear: number;
    bio: string;
    skills: string[];
    workplaces: string[];
    interests: string[];
    favoriteSubjects: string[];
    avatarFilename?: string;
    user: {
        id: number;
        username: string;
        avatarFilename?: string;
    };
}

interface User {
    id: number;
    username: string;
    email: string;
    profile: Profile;
}

interface Job {
    id: number;
    title: string;
    description: string;
    postedBy: number;
}

interface Message {
    id: number;
    sender: User;
    receiver: User;
    content: string;
    timestamp: string;
}

interface Notification {
    id: number;
    message: string;
    createdAt: string;
    read: boolean;
    type: string;
    senderId: number;
}

interface Post {
    id: number;
    content: string;
    createdAt: string;
    author: User;
}

export const apiService = createApi({
    reducerPath: 'apiService',
    tagTypes: ['Profile', 'User', 'Job', 'Message', 'Notification', 'Post'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
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
        uploadAvatar: builder.mutation<void, { username: string; file: FormData }>({
            query: ({ username, file }) => ({
                url: `users/${username}/avatar`,
                method: 'POST',
                body: file,
            }),
            invalidatesTags: [{ type: 'Profile', id: 'LIST' }]
        }),
        getUsers: builder.query<User[], void>({
            query: () => 'users',
        }),
        getJobs: builder.query<Job[], void>({
            query: () => 'jobs',
        }),
        getMessages: builder.query<Message[], number>({
            query: (userId) => `messages/${userId}`,
        }),
        sendMessage: builder.mutation<Message, { senderId: number; receiverId: number; content: string }>({
            query: ({ senderId, receiverId, content }) => ({
                url: 'messages',
                method: 'POST',
                body: { senderId, receiverId, content },
            }),
        }),
        getRecommendations: builder.query<Profile[], number>({
            query: (userId) => `recommendations/${userId}`,
        }),
        getNotifications: builder.query<Notification[], number>({
            query: (userId) => ({
                url: 'notifications',
                params: { userId },
            }),
        }),
        markNotificationAsRead: builder.mutation<void, number>({
            query: (notificationId) => ({
                url: `notifications/${notificationId}/read`,
                method: 'PUT',
            }),
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }]
        }),
        acceptFriendRequest: builder.mutation<void, { notificationId: number, senderId: number, receiverId: number }>({
            query: ({ notificationId, senderId, receiverId }) => ({
                url: `notifications/${notificationId}/accept`,
                method: 'POST',
                params: { senderId, receiverId },
            }),
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }]
        }),
        declineFriendRequest: builder.mutation<void, number>({
            query: (notificationId) => ({
                url: `notifications/${notificationId}/decline`,
                method: 'POST',
            }),
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }]
        }),
        getFriendsByUserId: builder.query<User[], number>({
            query: (userId) => `users/friends/${userId}`,
        }),
        getMentorRecommendations: builder.query<User[], number>({
            query: (userId) => `mentorship/recommendations/${userId}`,
        }),
        getMatchRecommendations: builder.query<User[], number>({
            query: (userId) => `matchmaking/recommendations/${userId}`,
        }),
        addFriend: builder.mutation<void, { userId1: number; userId2: number }>({
            query: ({ userId1, userId2 }) => ({
                url: `friendship/add`,
                method: 'POST',
                body: { userId1, userId2 },
            }),
            invalidatesTags: [{ type: 'Profile', id: 'LIST' }]
        }),
        getPosts: builder.query<Post[], void>({
            query: () => 'posts',
        }),
        createPost: builder.mutation<Post, Partial<Post>>({
            query: (post) => ({
                url: 'posts',
                method: 'POST',
                body: post,
            }),
            invalidatesTags: [{ type: 'Post', id: 'LIST' }]
        }),
    }),
});

export const {
    useGetMessagesQuery,
    useSendMessageMutation,
    useGetUsersQuery,
    useGetProfileByUsernameQuery,
    useCreateProfileMutation,
    useUpdateProfileMutation,
    useUploadAvatarMutation,
    useGetJobsQuery,
    useGetRecommendationsQuery,
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useAcceptFriendRequestMutation,
    useDeclineFriendRequestMutation,
    useGetFriendsByUserIdQuery,
    useGetMentorRecommendationsQuery,
    useGetMatchRecommendationsQuery,
    useAddFriendMutation,
    useGetPostsQuery,
    useCreatePostMutation,
} = apiService;
