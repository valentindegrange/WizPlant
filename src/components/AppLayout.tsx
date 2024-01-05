import React, { useState } from 'react';
import PlantCreateModalV2 from "./PlantCreateModalV2";
import {Link, useNavigate} from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Container, BottomNavigation, BottomNavigationAction, Switch } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {setAuthToken, setRefreshToken} from "../api/api"; // Import the AddBoxIcon for better visibility in the BottomNavigation

interface AppLayoutProps {
    children: React.ReactNode;
    mode: 'light' | 'dark';
    setMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, mode, setMode }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState(0);
    const navigate = useNavigate();

    const handleOpenModal = () => {
        // This function doesn't navigate, but instead opens the modal
        setIsModalOpen(true);
    };


    const handleLogout = () => {
        setAuthToken(null);
        setRefreshToken(null);
        // Redirect the user to the login page
        navigate('/login');
    };

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMode(event.target.checked ? 'dark' : 'light');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/plants">
                        <img src="/logo.png" alt="Logo" style={{ width: 50 }} />
                        <Typography sx={{pl:1}}variant="h6">PlantWiz</Typography>
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }} />
                    <Switch
                        checked={mode === 'dark'}
                        onChange={handleThemeChange}
                        icon={<LightModeIcon />}
                        checkedIcon={<DarkModeIcon />}
                    />
                    <IconButton color="inherit" onClick={handleLogout}>
                        <ExitToAppIcon />
                    </IconButton>
                    {/*<IconButton color="inherit" component={Link} to="/notifications">*/}
                    {/*    <NotificationsIcon />*/}
                    {/*</IconButton>*/}
                </Toolbar>
            </AppBar>

            <Container component="main" maxWidth="sm" style={{ marginBottom: 70, marginTop: 10 }}>
                {children}
            </Container>

            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    if (newValue === 1) { // Assumes the center position is index 1
                        handleOpenModal();
                    } else {
                        setValue(newValue);
                    }
                }}
                showLabels
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0
                }}
            >
                <BottomNavigationAction label="Plants" icon={<LocalFloristIcon />} component={Link} to="/plants" />
                <BottomNavigationAction label="Add Plant" icon={<AddBoxIcon />} />
                <BottomNavigationAction label="Notifications" icon={<NotificationsIcon />} component={Link} to="/notifications" />
                <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} component={Link} to="/profile" />
            </BottomNavigation>

            {isModalOpen && <PlantCreateModalV2 isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default AppLayout;
