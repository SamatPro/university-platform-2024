import React, { useState } from 'react';
import { useGetMatchRecommendationsQuery } from '../services/apiService';
import { FaHeart, FaTimes } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import styles from './MatchmakingPage.module.css';

const MatchmakingPage: React.FC = () => {
    const userId = parseInt(localStorage.getItem('currentUserId') || '0', 10);
    const { data: matches, error, isLoading } = useGetMatchRecommendationsQuery(userId);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

    const handleSwipe = (direction: 'left' | 'right') => {
        if (direction === 'left') {
            // Handle "like" action
        } else {
            // Handle "dislike" action
        }
        setCurrentMatchIndex((prevIndex) => prevIndex + 1);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading matches: {error.toString()}</div>;

    const currentMatch = matches && matches[currentMatchIndex];

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.mainContent}>
                <h1>Знакомства</h1>
                {currentMatch ? (
                    <div className={styles.matchCard}>
                        <div className={styles.avatar}>
                            {currentMatch.profile.avatarFilename ? (
                                <img src={`http://localhost:8080/api/users/avatar/${currentMatch.profile.avatarFilename}`} alt="Avatar" />
                            ) : (
                                <div className={styles.avatarPlaceholder}></div>
                            )}
                        </div>
                        <div className={styles.info}>
                            <h2>{currentMatch.profile.firstName} {currentMatch.profile.lastName}</h2>
                            <p>{currentMatch.profile.favoriteSubjects.join(', ')}</p>
                            <p>{currentMatch.profile.interests.join(', ')}</p>
                            <p>{currentMatch.profile.university}</p>
                            <div className={styles.buttons}>
                                <button className={styles.dislikeButton} onClick={() => handleSwipe('right')}>
                                    <FaTimes />
                                </button>
                                <button className={styles.likeButton} onClick={() => handleSwipe('left')}>
                                    <FaHeart />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>No more matches</div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default MatchmakingPage;
