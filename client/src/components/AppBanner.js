import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Typography, Box, Avatar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import  AuthContext  from '../auth';
import  GlobalStoreContext from '../store/';
import { useLocation, useNavigate } from 'react-router-dom'

const AppBanner = () => {
const { auth } = useContext(AuthContext);
const { store } = useContext(GlobalStoreContext);

const navigate = useNavigate();

const [anchorEl, setAnchorEl] = useState(null);
const isMenuOpen = Boolean(anchorEl);

const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
    setAnchorEl(null);
};

const handleLogin = () => {
    handleMenuClose();
    navigate("/login");
};

const handleRegister = () => {
    handleMenuClose();
    navigate("/register")
};

const handleEdit = () => {
    handleMenuClose();
    navigate("/edit");
};

const handleLogout = () => {
    handleMenuClose();
    auth.logoutUser();
};

const handleHome = () => {
    if (auth.loggedIn) {
        navigate("/playlists");
    } else {
        navigate("/");
    }
};

const handlePlaylistsTab = () => {
    navigate("/playlists");
};

const handleSongsTab = () => {
    navigate("/songs")
};

const menuId = 'account-menu';
const renderMenu = (
    <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
    >
        {auth.loggedIn ? (
            <>
                <MenuItem onClick={handleEdit}>Edit Account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </>
        ): (
            <>
                <MenuItem onClick={handleLogin}>Login</MenuItem>
                <MenuItem onClick={handleRegister}>Create Account</MenuItem>
            </>
        ) }
    </Menu>
);

const location = useLocation();
const path = location.pathname;
const showTabButtons = path === "/playlists" || path === "/songs";

return (
    <AppBar position="static">
        <Toolbar sx={{ position: "relative", display: "flex", backgroundColor: "#ee04ff" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={handleHome} sx={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "50%",
                    p: 1.2,
                    "&:hover": {
                        backgroundColor: "#eee"
                    }
                }}>
                    <HomeIcon />
                </IconButton>

                {showTabButtons && (
                    <>
                        <Button onClick={handlePlaylistsTab}sx={{
                            ml: 2,
                            backgroundColor: "#1e1e1e",
                            color: "white",
                            borderRadius: 2,
                            px: 3,
                            fontSize: "1rem",
                            "&:hover": {
                                backgroundColor: "#333"
                            }
                        }}>Playlists</Button>
                        <Button onClick={handleSongsTab}sx={{
                            ml: 2,
                            backgroundColor: "#3a64c4",
                            color: "white",
                            borderRadius: 2,
                            px: 3,
                            fontSize: "1rem",
                            "&:hover": {
                                backgroundColor: "#333"
                            }
                        }}>Song Catalog</Button>
                    </>
                )}
            </Box>

            <Typography
                variant="h6"
                sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontWeight: "bold"
                }}
            >
                The Playlister
            </Typography>

            <Box sx={{ marginLeft: "auto" }}>
                <IconButton edge="end" color="inherit" onClick={handleProfileMenuOpen}>
                    {
                        auth.loggedIn ? <Avatar
                        src={auth.user?.avatar}
                    /> : <AccountCircle />
                    }
                </IconButton>
            </Box>
        </Toolbar>

        {renderMenu}
    </AppBar>
);

};

export default AppBanner;