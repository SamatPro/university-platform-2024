import React from 'react';
import {useGetMentorRecommendationsQuery} from '../services/apiService';
import {Link} from 'react-router-dom';
import styles from './MentorRecommendationsPage.module.css';
import Header from './Header';
import Footer from './Footer';

const MentorRecommendationsPage: React.FC = () => {
    const userId = parseInt(localStorage.getItem('currentUserId') || '0', 10);
    const {data: mentors, error, isLoading} = useGetMentorRecommendationsQuery(userId);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading mentor recommendations: {error.toString()}</div>;

    return (
        <div>
            <Header/>
            <div className={styles.container}>

                <main className={styles.mainContent}>
                    <h1>Рекомендации менторов</h1>
                    <ul className={styles.mentorList}>
                        {mentors?.filter(mentor => mentor.profile && mentor.profile.firstName && mentor.profile.lastName).map((mentor) => (
                            <li key={mentor.id} className={styles.mentorItem}>
                                <Link to={`/profile/${mentor.username}`}>
                                    <div className={styles.avatar}>
                                        {mentor.profile.avatarFilename ? (
                                            <img
                                                src={`http://localhost:8080/api/users/avatar/${mentor.profile.avatarFilename}`}
                                                alt="Avatar"/>
                                        ) : (
                                            <div className={styles.avatarPlaceholder}></div>
                                        )}
                                    </div>
                                    <div className={styles.info}>
                                        <div>{mentor.profile.firstName} {mentor.profile.lastName}</div>
                                        <div>{mentor.profile.university}</div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </main>
                <Footer/>
            </div>
        </div>
    );
};

export default MentorRecommendationsPage;
