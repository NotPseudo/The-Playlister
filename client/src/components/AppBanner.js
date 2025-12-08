import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import { AuthContext } from '../context/AuthContext';
import { GlobalStoreContext } from '../context/GlobalStoreContext';
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
        <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleHome}>
                <HomeIcon />
            </IconButton>
            {showTabButtons && (
                <>
                    <Button color="inherit" onClick={handlePlaylistsTab}>Playlists</Button>
                    <Button color="inherit" onClick={handleSongsTab}>Song Catalog</Button>
                </>
            )}
            <Typography variant="h6" style={{ flexGrow: 1, marginLeft: 20 }}>
                The Playlister
            </Typography>
            <IconButton
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
            >
                <AccountCircle />
            </IconButton>
        </Toolbar>
        {renderMenu}
    </AppBar>
);

};

export default AppBanner;