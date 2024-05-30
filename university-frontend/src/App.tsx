// src/App.tsx
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import HomePage from './components/HomePage';
import UserProfilePage from './components/UserProfilePage';
import NetworkPage from './components/NetworkPage';
import JobsPage from './components/JobsPage';
import Login from './components/Login';
import {SearchComponent} from "./components/SearchComponent";
import Chat from "./components/ChatPage";
import EditProfilePage from "./components/EditProfilePage";
import ChatPage from "./components/ChatPage";
import NotificationsPage from "./components/NotificationsPage";

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
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/search" element={<SearchComponent />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
