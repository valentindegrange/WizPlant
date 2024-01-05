import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { changePassword } from "../api/api";

interface EditPasswordModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onPasswordChangeSuccess: () => void;
}

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({
    isOpen,
    onRequestClose,
    onPasswordChangeSuccess,
}) => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            // Passwords do not match, show an error or handle it accordingly
            return;
        }

        try {
            // Call the changePassword API function with the old and new passwords
            await changePassword({
                old_password: formData.oldPassword,
                new_password: formData.newPassword,
            });

            // Password change successful, close the modal and trigger the success callback
            onRequestClose();
            onPasswordChangeSuccess();
        } catch (error) {
            console.error("Error changing password:", error);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onRequestClose}>
            <DialogTitle>Change Password</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="Old Password"
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        required
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        required
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onRequestClose}>Cancel</Button>
                    <Button type="submit">Change Password</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditPasswordModal;
