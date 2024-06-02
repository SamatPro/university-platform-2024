// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserProfilePage from './components/UserProfilePage';
import NetworkPage from './components/NetworkPage';
import JobsPage from './components/JobsPage';
import Login from './components/Login';
import { SearchComponent } from "./components/SearchComponent";
import ChatPage from "./components/ChatPage";
import NotificationsPage from "./components/NotificationsPage";
import FriendsPage from './components/FriendsPage';
import EditProfilePage from "./components/EditProfilePage";
import MentorRecommendationsPage from "./components/MentorRecommendationsPage";
import MatchmakingPage from "./components/MatchmakingPage";
import PostsPage from "./components/PostsPage"; // Импорт нового компонента

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile/:username" element={<UserProfilePage />} />
                <Route path="/profile/:username/edit" element={<EditProfilePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:userId" element={<ChatPage />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/mentor-recommendations" element={<MentorRecommendationsPage />} />
                <Route path="/matchmaking" element={<MatchmakingPage />} />
                <Route path="/posts" element={<PostsPage />} />
                <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
