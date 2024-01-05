import React, {useEffect, useState, useMemo} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import PlantsPage from './pages/PlantsPage';
import LoginPage from './pages/LoginPage';
import PlantDetailsPage from './pages/PlantDetailsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import {setAuthToken} from './api/api';
import AppLayout from './components/AppLayout';
import AppDefaultLayout from './components/AppDefaultLayout';
import Modal from 'react-modal';
import SignupPage from './pages/SignupPage';
import {ThemeProvider} from '@mui/material/styles';
import getTheme from './theme';
import CssBaseline from '@mui/material/CssBaseline';


const App = () => {
    Modal.setAppElement('#root');
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    useEffect(() => {
        // Check for user's preferred theme
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setMode(prefersDarkMode ? 'dark' : 'light');
    }, []);
    // In your main App component or a similar initialization script
    useEffect(() => {
        const token = localStorage.getItem('jwt-token');
        if (token) {
            setAuthToken(token);
        }
    }, []);
    // Check if the user is logged in based on tokens in localStorage
    const isUserLoggedIn = localStorage.getItem('jwt-token') && localStorage.getItem('refresh-token');
    const theme = useMemo(() => getTheme(mode), [mode]); // Use useMemo to optimize performance

    // A custom guard route for authenticated routes
    const ProtectedRoute = ({element}: { element: React.ReactNode }) => {
        const isUserLoggedIn = localStorage.getItem('jwt-token') && localStorage.getItem('refresh-token');
        console.log(isUserLoggedIn);
        return isUserLoggedIn ? (
            <>{element}</>
        ) : (
            <Navigate to="/login" replace/>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <AppDefaultLayout>
                                <LoginPage/>
                            </AppDefaultLayout>
                        }
                    />
                    <Route
                        path="/sign-up"
                        element={
                            <AppDefaultLayout>
                                <SignupPage/>
                            </AppDefaultLayout>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            isUserLoggedIn ? (
                                <Navigate to="/plants"/>
                            ) : (
                                <Navigate to="/login"/>
                            )
                        }
                    />
                    {/* Authenticated routes */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute
                                element={
                                    <AppLayout mode={mode} setMode={setMode}>
                                        <Routes>
                                            <Route path="/plants" element={<PlantsPage/>}/>
                                            <Route path="/plants/:id" element={<PlantDetailsPage/>}/>
                                            <Route path="/profile" element={<ProfilePage/>}/>
                                            <Route path="/notifications" element={<NotificationsPage/>}/>
                                        </Routes>
                                    </AppLayout>
                                }
                            />
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
