import React, {useEffect, useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import { loginUser, setAuthToken, setRefreshToken } from "../api/api";
import { Container, Box, Typography, TextField, Button, Paper, Link } from '@mui/material';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const isUserLoggedIn = localStorage.getItem('jwt-token') && localStorage.getItem('refresh-token');
    useEffect(() => {
        if (isUserLoggedIn) {
            navigate('/plants');
        }
    },);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const loginData = { email, password };
            const userData = await loginUser(loginData);
            const token = userData.access;
            const refreshToken = userData.refresh;

            setRefreshToken(refreshToken);
            setAuthToken(token);

            console.log('Login successful', userData);
            console.log(localStorage)
            navigate('/plants');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>

                    <Typography variant="body2" sx={{mt: 3, mb: 2}} align="right">
                        Don't have an account yet? <Link component={RouterLink} to='/sign-up'>Sign Up</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
