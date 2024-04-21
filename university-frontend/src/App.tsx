// src/App.tsx
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import HomePage from './components/HomePage';
import UserProfilePage from './components/UserProfilePage';
import NetworkPage from './components/NetworkPage';
import JobsPage from './components/JobsPage';
import Login from "./components/login";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile/:username" element={<UserProfilePage />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
