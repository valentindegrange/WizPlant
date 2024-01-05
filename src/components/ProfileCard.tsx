import React from "react";
import { User } from "../types";
import { Card, CardContent, Typography } from '@mui/material';
import {languages, getLanguageIcon} from "../constants/constants";

interface ProfileProps {
    user: User;
}

const ProfileCard: React.FC<ProfileProps> = ({ user }) => {

   return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>My Information</Typography>
                <Typography>{user.first_name} {user.last_name}</Typography>
                <Typography>{user.email}</Typography>
                <Typography>{user.phone_number}</Typography>
                <Typography>{getLanguageIcon(user.default_language)} {languages[user.default_language]}</Typography>
            </CardContent>
        </Card>
    );
}

export default ProfileCard;