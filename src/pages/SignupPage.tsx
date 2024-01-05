import React, {useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Stepper,
    Step,
    StepLabel,
    Paper, FormControlLabel, Checkbox, Link, Select, InputLabel, MenuItem, FormControl
} from '@mui/material';
import {signup, editUser, editNotificationCenter, loginUser, setRefreshToken, setAuthToken} from '../api/api'; // Import your API functions
import {getLanguageIcon, languages} from "../constants/constants";

const SignupPage = () => {
    // Step 1: User Info
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 2: Basic Info
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [default_language, setDefaultLanguage] = useState('');

    // Step 3: Notification Preferences
    const [enable_in_app_notifications, setInAppNotifications] = useState(false);
    const [enable_email_notifications, setEmailNotifications] = useState(false);
    const [enable_sms_notifications, setSmsNotifications] = useState(false);
    const [preferred_notification_hour, setNotificationHour] = useState('');

    // Current step state
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();

    // Handle Next button click
    const handleNext = async () => {
        console.log(activeStep);
        if (activeStep === 0) {
            // Step 1 validation
            if (password !== confirmPassword) {
                console.log('Passwords do not match');
                return;
            }

            // Call API to create user (signup)
            try {
                const userData = await signup({email, password});
                console.log('Signup successful:', userData);
                const loginData = await loginUser({email, password});
                const token = loginData.access;
                const refreshToken = loginData.refresh;

                setRefreshToken(refreshToken);
                setAuthToken(token);

                // If user created successfully, proceed to next step
                setActiveStep(activeStep + 1);
            } catch (error) {
                // Handle signup error
                console.error('Signup failed:', error);
            }
        } else if (activeStep === 1) {
            // Step 2 validation
            // Validate first name, last name, and phone number if needed

            // Call API to edit user info
            try {
                await editUser({first_name, last_name, phone_number, default_language});
                // If user info updated successfully, proceed to next step
                setActiveStep(activeStep + 1);
            } catch (error) {
                // Handle edit user info error
                console.error('Edit user info failed:', error);
            }
        } else if (activeStep === 2) {
            // Step 3 validation
            // Validate notification preferences if needed

            // Call API to edit notification preferences
            try {
                await editNotificationCenter({
                    enable_in_app_notifications,
                    enable_email_notifications,
                    enable_sms_notifications,
                    preferred_notification_hour,
                });
                // If notification preferences updated successfully, redirect to /plants
                navigate("/plants");
            } catch (error) {
                // Handle edit notification preferences error
                console.error('Edit notification preferences failed:', error);
            }
        }
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('Called')
        e.preventDefault(); // Prevent the default form submission behavior
        handleNext(); // Trigger the "Next" button click handler
    };


    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{p: 4, mt: 8}}>
                <Typography component="h1" variant="h4" sx={{mb: 3}}>
                    Sign Up
                </Typography>
                <Typography variant="body2" sx={{mb: 3}}>
                    Welcome to WizPlant! Ready to get started?
                </Typography>
                <Stepper activeStep={activeStep} alternativeLabel>
                    <Step>
                        <StepLabel>Step 1: User Info</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Step 2: Basic Info</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Step 3: Notification Preferences</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Step 4: Enjoy!</StepLabel>
                    </Step>
                </Stepper>
                <form onSubmit={handleSubmit}>
                    {activeStep === 0 && (
                        <div>
                            <Typography component="h2" variant="h5">User Info</Typography>
                            <TextField
                                label="Email"
                                fullWidth
                                margin="normal"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                label="Password"
                                fullWidth
                                margin="normal"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                label="Confirm Password"
                                fullWidth
                                margin="normal"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Typography variant="body2" sx={{mt: 3, mb: 2}} align="right">
                                Already have an account? <Link component={RouterLink} to="/login">Login</Link>
                            </Typography>
                        </div>
                    )}
                    {activeStep === 1 && (
                        <div>
                            <Typography variant="h5">Basic Info</Typography>
                            <TextField
                                label="First Name"
                                type="text"
                                fullWidth
                                margin="normal"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                label="Last Name"
                                type="text"
                                fullWidth
                                margin="normal"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <TextField
                                label="Phone Number"
                                type="tel"
                                fullWidth
                                margin="normal"
                                value={phone_number}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Language</InputLabel>
                                <Select
                                    name="default_language"
                                    value={default_language}
                                    onChange={(e) => setDefaultLanguage(e.target.value)}
                                    label="Select Language"
                                >
                                    {Object.entries(languages).map(([langCode, langName]) => (
                                        <MenuItem key={langCode} value={langCode}>
                                            {getLanguageIcon(langCode)} {langName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    )}
                    {activeStep === 2 && (
                        <div>
                            <Typography variant="h5">Notification Preferences</Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="enable_in_app_notifications"
                                        checked={enable_in_app_notifications}
                                        onChange={(e) => setInAppNotifications(e.target.checked)}
                                    />
                                }
                                label="Enable In-App Notifications"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="enable_email_notifications"
                                        checked={enable_email_notifications}
                                        onChange={(e) => setEmailNotifications(e.target.checked)}
                                    />
                                }
                                label="Enable Email Notifications"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="enable_sms_notifications"
                                        checked={enable_sms_notifications}
                                        onChange={(e) => setSmsNotifications(e.target.checked)}
                                    />
                                }
                                label="Enable SMS Notifications"
                            />
                            <TextField
                                label="Preferred Notification Hour"
                                type="number"
                                name="preferred_notification_hour"
                                value={preferred_notification_hour}
                                onChange={(e) => setNotificationHour(e.target.value)}
                                fullWidth
                                margin="dense"
                            />
                        </div>
                    )}
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth={true}
                            disabled={activeStep === 3}

                        >
                            {activeStep === 2 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </form>
            </Paper>
        </Container>
    );
};

export default SignupPage;
