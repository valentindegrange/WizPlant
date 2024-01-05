export interface Plant {
    id: number | undefined;
    name: string;
    description: string;
    image: string;

    created: string;
    updated: string;
    last_fertilized: string;
    last_repotted: string;
    last_watered: string;
    next_fertilize_date: string;
    next_repotting_date: string;
    next_water_date: string;

    should_fertilize: boolean;
    should_repot: boolean;
    should_water: boolean;

    is_complete: boolean;

    needs_care: boolean;
    extra_tips: string;
    leaf_mist: boolean;
    sun_exposure: string;
    sunlight: string;

    water_frequency_summer: string;
    water_frequency_winter: string;

    water_frequency: string;

    fertilizer: boolean;
    fertilizer_season: string;

    repotting: boolean;
    repotting_season: string;

}

export interface User {
    id: number | undefined;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    default_language: string;
}

export interface NotificationCenter {
    enable_in_app_notifications: boolean;
    enable_email_notifications: boolean;
    enable_sms_notifications: boolean;
    preferred_notification_hour: number;
    last_notification_sent: string;
}

export interface Notification {
    id: number | undefined;
    message: string;
    notification_type: string;
    sent: boolean;
    sent_at: string;
    viewed: boolean;
    viewed_at: string;
}