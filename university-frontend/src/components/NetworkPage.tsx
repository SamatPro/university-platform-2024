// src/components/NetworkPage.tsx
import React from 'react';
import { useGetUsersQuery } from '../services/apiService';
import Header from "./Header";
import Footer from "./Footer";

const NetworkPage: React.FC = () => {
    const { data: users, error, isLoading } = useGetUsersQuery();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading users.</div>;

    return (
        <div>
            <Header/>
            <h1>Network</h1>
            <ul>
                {users?.map(user => (
                    <li key={user.id}>{user.username} - {user.email}</li>
                ))}
            </ul>
            <Footer/>
        </div>
    );
}

export default NetworkPage;
