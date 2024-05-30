import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetProfileByUsernameQuery } from '../services/apiService';
import Footer from './Footer';
import Header from './Header';
import styles from './UserProfilePage.module.css';

const UserProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { data: profile, error, isLoading } = useGetProfileByUsernameQuery(username ?? '');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !username) {
            navigate('/login');
        }
    }, [navigate, username]);

    const currentUsername = localStorage.getItem('username');

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading profile: {error.toString()}</div>;
    if (!profile) return <div>No profile data available.</div>;

    return (
        <div className={styles.profilePage}>
            <Header />
            <main className={styles.mainContent}>
                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        {profile.avatarFilename ? (
                            <img
                                src={`http://localhost:8080/api/users/avatar/${profile.avatarFilename}`}
                                alt="Avatar"
                                className={styles.avatar}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}></div>
                        )}
                        <h1>{profile.firstName} {profile.lastName}</h1>
                        <p className={styles.username}>@{profile.user.username}</p>
                        {currentUsername === username && (
                            <Link to={`/profile/${username}/edit`} className={styles.editButton}>Edit Profile</Link>
                        )}
                    </div>
                    <div className={styles.profileDetails}>
                        <p><strong>University:</strong> {profile.university}</p>
                        <p><strong>Graduation Year:</strong> {profile.graduationYear}</p>
                        <p><strong>Bio:</strong> {profile.bio}</p>
                        <p><strong>Skills:</strong> {profile.skills.join(', ')}</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserProfilePage;
