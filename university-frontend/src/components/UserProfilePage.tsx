import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useGetProfileByUsernameQuery, useUpdateProfileMutation} from '../services/apiService';
import Footer from "./Footer";
import Header from "./Header";
import styles from './HomePage.module.css';

const UserProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();

    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const handleUpdate = async () => {
        if (profile) {
            const updatedProfile = { ...profile, bio: 'Updated bio...' };
            await updateProfile({ id: profile.id, profile: updatedProfile });
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !username) {
            navigate('/login');
        } else {

        }
    }, [navigate]);

    const { data: profile, error } = useGetProfileByUsernameQuery(username ?? '');

    if (error) return <div>Error loading profile: </div>;
    if (!profile) return <div>No profile data available.</div>;

    return (
        <div className={styles.homePage}>
            <Header/>
            <main className={styles.mainContent}>

                <div>
                    <h1>{profile.user.username}'s Profile</h1>
                    <p>Name: {profile.firstName} {profile.lastName}</p>
                    <p>University: {profile.university}</p>
                    <p>Graduation Year: {profile.graduationYear}</p>
                    <p>Bio: {profile.bio}</p>
                    <button onClick={handleUpdate} disabled={isLoading}>Update Bio</button>
                </div>

            </main>
            <Footer/>
        </div>

    );
};

export default UserProfilePage;
