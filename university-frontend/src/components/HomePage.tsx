// src/components/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the University Platform</h1>
            <nav>
                <ul>
                    <li><Link to="/profile/1">My Profile</Link></li>
                    <li><Link to="/network">Network</Link></li>
                    <li><Link to="/jobs">Jobs</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default HomePage;
