import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, FormControlLabel, Checkbox, DialogActions, Button, TextField } from '@mui/material';
import { editNotificationCenter } from "../api/api";
import { NotificationCenter } from "../types";

interface NotificationCenterEditModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    notificationCenter: NotificationCenter;
    onEditSuccess: () => void;
}

const NotificationCenterEditModal: React.FC<NotificationCenterEditModalProps> = ({
    isOpen,
    onRequestClose,
    notificationCenter,
    onEditSuccess,
}) => {
    const [formData, setFormData] = useState(notificationCenter);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Call the editNotificationCenter API function with the updated data
            await editNotificationCenter(formData);
            onEditSuccess(); // Notify the parent component about the edit success
        } catch (error) {
            console.error("Error editing notification center:", error);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onRequestClose}>
            <DialogTitle>Edit Notification Center</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="enable_in_app_notifications"
                                checked={formData.enable_in_app_notifications}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Enable In-App Notifications"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="enable_email_notifications"
                                checked={formData.enable_email_notifications}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Enable Email Notifications"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="enable_sms_notifications"
                                checked={formData.enable_sms_notifications}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Enable SMS Notifications"
                    />
                    <TextField
                        label="Preferred Notification Hour"
                        type="number"
                        name="preferred_notification_hour"
                        value={formData.preferred_notification_hour}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onRequestClose}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default NotificationCenterEditModal;
