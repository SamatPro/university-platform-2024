import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetProfileByUsernameQuery } from '../services/apiService';
import Header from './Header';
import Footer from './Footer';
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
                        <div className={styles.profileInfo}>
                            <h1>{profile.firstName} {profile.lastName}</h1>
                            <p className={styles.username}>Ник: @{profile.user.username}</p>
                            {currentUsername === username && (
                                <Link to={`/profile/${username}/edit`} className={styles.editButton}>Редактировать</Link>
                            )}
                        </div>
                    </div>
                    <div className={styles.profileDetails}>
                        <p><strong>Университет:</strong> {profile.university}</p>
                        <p><strong>Год выпуска:</strong> {profile.graduationYear}</p>
                        <p><strong>О себе:</strong> {profile.bio}</p>
                        <p><strong>Навыки:</strong> {profile.skills.join(', ')}</p>
                        <p><strong>Места работы:</strong> {profile.workplaces.join(', ')}</p>
                        <p><strong>Интересы:</strong> {profile.interests.join(', ')}</p>
                        <p><strong>Любимые предметы:</strong> {profile.favoriteSubjects.join(', ')}</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserProfilePage;
