import React, {useState, useEffect} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Select,
    InputLabel, FormControl,
    MenuItem, SelectChangeEvent,
} from '@mui/material';
import {editUser} from "../api/api";
import {User} from "../types";
import {getLanguageIcon, languages} from "../constants/constants";

interface ProfileEditModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    user: User | null;
    onEditSuccess: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({isOpen, onRequestClose, user, onEditSuccess}) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        default_language: "",
    });

    useEffect(() => {
        console.log(user);
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                default_language: user.default_language,
            });
        }
    }, [user]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await editUser(formData);
            onRequestClose();
            onEditSuccess();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLanguageChange = (e: SelectChangeEvent<string>) => {
        const selectedLanguage = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            default_language: selectedLanguage,
        }));
    };

    return (
        <Dialog open={isOpen} onClose={onRequestClose}>
            <DialogTitle>Edit Profile</DialogTitle>
            <form onSubmit={handleFormSubmit}>
                <DialogContent>
                    <TextField
                        label="First Name"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Last Name"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Phone Number"
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Language</InputLabel>
                        <Select
                            name="default_language"
                            value={formData.default_language}
                            onChange={handleLanguageChange}
                            label="Select Language"
                        >
                            {Object.entries(languages).map(([langCode, langName]) => (
                                <MenuItem key={langCode} value={langCode}>
                                    {getLanguageIcon(langCode)} {langName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onRequestClose}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProfileEditModal;
