import React, {useEffect, useState, useRef, useCallback} from "react";
import {getNotifications} from "../api/api";
import {Notification} from "../types";
import NotificationCard from "../components/NotificationCard";
import { List, Typography, Box } from '@mui/material';

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const loader = useRef(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await getNotifications({
                notification_type: 'IN_APP',
                ordering: 'viewed,-sent_at',
                page: page
            });
            setNotifications(prev => [...prev, ...data.results]);
            setHasMore(data.next != null);
        } catch (error) {
            console.error(error);
        }
    }, [page]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (!hasMore) return;

        if (observer.current) observer.current.disconnect();
        const callback = (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => prevPage + 1);
            }
        };

        observer.current = new IntersectionObserver(callback, {
            root: null,
            rootMargin: "20px",
            threshold: 0.1
        });

        if (loader.current) {
            observer.current.observe(loader.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [loader, hasMore]);

    return (
        <Box sx={{flexGrow: 1, padding: 3}}>
            <Typography variant="h4" component="div" gutterBottom>
                My Notifications
            </Typography>
            <List>
                {notifications.map(notification => (
                    <NotificationCard key={notification.id} notification={notification} />
                ))}
            </List>
            <div ref={loader} style={{ height: "20px" }} />
        </Box>
    );
};

export default NotificationsPage;
