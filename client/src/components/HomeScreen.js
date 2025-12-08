import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const HomeScreen = () => {
    const navigate = useNavigate();

    const handleGuest = () => {
        navigate('/playlists'); 
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleCreateAccount = () => {
        navigate('/register');
    };

    return (
        <Box
            sx={{
                textAlign: 'center',
                mt: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Typography variant="h3" sx={{ mb: 4 }}>
                The Playlister
            </Typography>

            <Box sx={{ mb: 4 }}>
                <MusicNoteIcon sx={{ fontSize: 180 }} />
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 3,
                mt: 2
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGuest}
                >
                    Continue as Guest
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                >
                    Login
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateAccount}
                >
                    Create Account
                </Button>
            </Box>
        </Box>
    );
};

export default HomeScreen;
