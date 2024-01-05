import React from "react";
import { Notification } from "../types";
import { ListItem, ListItemText, ListItemIcon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { format } from 'date-fns'; // Assuming you're using date-fns for formatting dates

interface NotificationItemProps {
    notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    return (
        <ListItem>
            <ListItemIcon>
                {notification.viewed ? <CheckCircleIcon /> : <NotificationsIcon />}
            </ListItemIcon>
            <ListItemText
                primary={notification.message}
                secondary={format(new Date(notification.sent_at), 'PPPppp')}
            />
        </ListItem>
    );
};

export default NotificationItem;
