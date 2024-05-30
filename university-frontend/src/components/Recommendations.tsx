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
            <ul>
                {recommendations?.map((profile) => (
                    <li key={profile.id} className={styles.recommendation}>
                        <Link to={`/profile/${profile.user.username}`}>
                            <div className={styles.avatar}>
                                <img src={`http://localhost:8080/api/users/avatar/${profile.user.avatarFilename}`} alt="Avatar" />
                            </div>
                            <div className={styles.info}>
                                <div>{profile.firstName} {profile.lastName}</div>
                                <div>{profile.university}</div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Recommendations;
