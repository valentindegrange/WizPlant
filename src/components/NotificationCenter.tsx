import React from "react";
import {NotificationCenter} from "../types";
import { Card, CardContent, Typography } from '@mui/material';

interface NotificationCenterProps {
    notificationCenter: NotificationCenter;
}

const NotificationCenterCard: React.FC<NotificationCenterProps> = ({notificationCenter}) => {

     return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>My Notification Center</Typography>
                <Typography>Notify me every day at {notificationCenter.preferred_notification_hour}:00</Typography>
                <Typography>In-App: {notificationCenter.enable_in_app_notifications ? "Yes" : "No"}</Typography>
                <Typography>Email: {notificationCenter.enable_email_notifications ? "Yes" : "No"}</Typography>
                <Typography>SMS: {notificationCenter.enable_sms_notifications ? "Yes" : "No"}</Typography>
            </CardContent>
        </Card>
    );
};

export default NotificationCenterCard;