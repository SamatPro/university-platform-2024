import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from './HomePage.module.css';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div className={styles.homePage}>
            <Header />
            <main className={styles.mainContent}>
                <section className={styles.welcomeSection}>
                    <h1>Добро пожаловать в социальную сеть Университета</h1>
                    <p>Платформа предназначена для создания и поддержания связи между студентами и выпускниками университета.</p>
                </section>
                <section className={styles.featuresSection}>
                    <h2>Возможности платформы</h2>
                    <ul>
                        <li>Создание и обновление профиля</li>
                        <li>Поиск и добавление друзей</li>
                        <li>Обмен сообщениями и уведомления</li>
                        <li>Получение рекомендаций менторов и контактов</li>
                        <li>Новые знакомства</li>
                    </ul>
                </section>
                <section className={styles.callToActionSection}>
                    <h2>Начните прямо сейчас</h2>
                    <p>Войдите в систему, чтобы начать использовать все возможности платформы.</p>
                    <Link to="/login" className={styles.loginButton}>Вход</Link>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;
