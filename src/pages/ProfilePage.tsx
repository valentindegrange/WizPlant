import React, { useEffect, useState } from "react";
import { getUser, getNotificationCenter } from "../api/api";
import { User, NotificationCenter } from "../types";
import ProfileCard from "../components/ProfileCard";
import NotificationCenterCard from "../components/NotificationCenter";
import ProfileEditModal from "../components/ProfileEditModal";
import NotificationCenterEditModal from "../components/NotificationCenterEditModal";
import EditPasswordModal from "../components/EditPasswordModal";
import { Box, CircularProgress, Button } from '@mui/material';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [notificationCenter, setNotificationCenter] = useState<NotificationCenter | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNotificationCenterModalOpen, setIsNotificationCenterModalOpen] = useState(false);
    const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false); // Add state for Change Password modal


    const fetchUserData = async () => {
        try {
            const userData = await getUser();
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchNotificationCenterData = async () => {
            try {
                const notificationCenterData = await getNotificationCenter();
                setNotificationCenter(notificationCenterData);
            } catch (error) {
                console.error('Error fetching notification center:', error);
            }
        };
        fetchNotificationCenterData();
    }, []);

    const handleUserEditSuccess = () => {
        // Close the edit modal and refetch user data
        setIsEditModalOpen(false);
        fetchUserData(); // Refetch user data after a successful edit
    };

    const handleNotificationCenterEditSuccess = () => {
        // Close the NotificationCenterEdit modal and refetch notification center data
        setIsNotificationCenterModalOpen(false);
        const fetchNotificationCenterData = async () => {
            try {
                const notificationCenterData = await getNotificationCenter();
                setNotificationCenter(notificationCenterData);
            } catch (error) {
                console.error('Error fetching notification center:', error);
            }
        };
        fetchNotificationCenterData();
    };

    const handleChangePasswordSuccess = () => {
        setIsEditPasswordModalOpen(false);
    };


    return (
        <Box sx={{ p: 3 }}>
            {user ? (
                <>
                    <ProfileCard user={user} />
                    <Button variant="outlined" onClick={() => setIsEditPasswordModalOpen(true)} sx={{mr: 4}}>Change Password</Button>
                    <EditPasswordModal
                        isOpen={isEditPasswordModalOpen}
                        onRequestClose={() => setIsEditPasswordModalOpen(false)}
                        onPasswordChangeSuccess={handleChangePasswordSuccess}
                    />
                    <Button variant="outlined" onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
                    <ProfileEditModal
                        isOpen={isEditModalOpen}
                        onRequestClose={() => setIsEditModalOpen(false)}
                        user={user}
                        onEditSuccess={handleUserEditSuccess}
                    />
                </>
            ) : (
                <CircularProgress />
            )}

            {notificationCenter ? (
                <>
                    <NotificationCenterCard notificationCenter={notificationCenter} />
                    <Button variant="outlined" onClick={() => setIsNotificationCenterModalOpen(true)}>Edit Notifications</Button>
                    <NotificationCenterEditModal
                        isOpen={isNotificationCenterModalOpen}
                        onRequestClose={() => setIsNotificationCenterModalOpen(false)}
                        notificationCenter={notificationCenter}
                        onEditSuccess={handleNotificationCenterEditSuccess}
                    />
                </>
            ) : (
                <CircularProgress />
            )}
        </Box>
    );
};

export default ProfilePage;
