import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
    return (
        <div className={styles.homePage}>
            <Header />
            <main className={styles.mainContent}>

                <h1>Welcome to the University Network</h1>

            </main>
            <Footer />
        </div>
    );
}

export default HomePage;