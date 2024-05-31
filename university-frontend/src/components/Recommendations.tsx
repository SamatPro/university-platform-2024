// src/components/Recommendations.tsx
import React from 'react';
import { useGetRecommendationsQuery } from '../services/apiService';
import { Link } from 'react-router-dom';
import styles from './Recommendations.module.css';

const Recommendations: React.FC<{ userId: number }> = ({ userId }) => {
    const { data: recommendations, error, isLoading } = useGetRecommendationsQuery(userId);

    if (isLoading) return <div>Loading recommendations...</div>;
    if (error) return <div>Error loading recommendations: {error.toString()}</div>;

    return (
        <div className={styles.recommendations}>
            <h2>Recommended Friends</h2>
            <div className={styles.recommendationList}>
                {recommendations?.filter(profile => profile.user.id !== userId).map((profile) => (
                    <div key={profile.id} className={styles.recommendation}>
                        <Link to={`/profile/${profile.user.username}`} className={styles.recommendationLink}>
                            <div className={styles.avatar}>
                                {profile.avatarFilename ? (
                                    <img src={`http://localhost:8080/api/users/avatar/${profile.avatarFilename}`} alt="Avatar" />
                                ) : (
                                    <div className={styles.avatarPlaceholder}></div>
                                )}
                            </div>
                            <div className={styles.info}>
                                <div>{profile.firstName} {profile.lastName}</div>
                                <div>{profile.university}</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommendations;
