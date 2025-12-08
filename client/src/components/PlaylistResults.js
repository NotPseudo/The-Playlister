import React, { useContext, useState } from "react";
import {
    Box,
    Typography,
    Menu,
    MenuItem,
    Button,
    IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AuthContext } from '../auth/';
import { GlobalStoreContext, ListSortType } from '../store/';
import PlaylistCard from "./PlaylistCard"; // will be implemented next

const PlaylistResults = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    // Menu anchor for sort selector
    const [anchor, setAnchor] = useState(null);

    // Shown text for current sort option
    const [sortTypeDisplay, setSortTypeDisplay] = useState("Listeners (Hi-Lo)");

    const handleSortTypeListOpen = (event) => {
        setAnchor(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchor(null);
    };

    const handleListenersHiLo = () => {
        setSortTypeDisplay("Listeners (Hi-Lo)");
        store.setListOrder(ListSortType.LISTENERS_HILO);
        setAnchor(null);
    };

    const handleListenersLoHi = () => {
        setSortTypeDisplay("Listeners (Lo-Hi)");
        store.setListOrder(ListSortType.LISTENERS_LOHI);
        setAnchor(null);
    };

    const handleNameAZ = () => {
        setSortTypeDisplay("Playlist Name (A-Z)");
        store.setListOrder(ListSortType.NAME_AZ);
        setAnchor(null);
    };

    const handleNameZA = () => {
        setSortTypeDisplay("Playlist Name (Z-A)");
        store.setListOrder(ListSortType.NAME_ZA);
        setAnchor(null);
    };

    const handleOwnerNameAZ = () => {
        setSortTypeDisplay("Owner Username (A-Z)");
        store.setListOrder(ListSortType.USERNAME_AZ);
        setAnchor(null);
    };

    const handleOwnerNameZA = () => {
        setSortTypeDisplay("Owner Username (Z-A)");
        store.setListOrder(ListSortType.USERNAME_ZA);
        setAnchor(null);
    };

    const handleNewPlaylist = () => {
        store.createNewList();
    };

    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6">Sort:</Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            color: "#3f6ee9",
                            cursor: "pointer",
                            textDecoration: "underline"
                        }}
                        onClick={handleSortTypeListOpen}
                    >
                        {sortTypeDisplay}
                    </Typography>
                </Box>

                <Typography variant="h6">
                    {store.playlistResults.length} Playlists
                </Typography>
            </Box>

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <MenuItem onClick={handleListenersHiLo}>Listeners Hi - Lo</MenuItem>
                <MenuItem onClick={handleListenersLoHi}>Listeners Lo - Hi</MenuItem>
                <MenuItem onClick={handleNameAZ}>Playlist Name A - Z</MenuItem>
                <MenuItem onClick={handleNameZA}>Playlist Name Z - A</MenuItem>
                <MenuItem onClick={handleOwnerNameAZ}>Owner Username A - Z</MenuItem>
                <MenuItem onClick={handleOwnerNameZA}>Owner username Z - A</MenuItem>

            </Menu>

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    pr: 1,
                    pb: 3
                }}
            >
                {store.playlistResults.map((playlist) => (
                    <PlaylistCard key={playlist._id} playlist={playlist} />
                ))}
            </Box>

            <Box sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleNewPlaylist}
                    sx={{
                        backgroundColor: "#6e3caf",
                        borderRadius: "30px",
                        py: 1.5,
                        px: 3,
                        ":hover": { backgroundColor: "#8d5cd0" }
                    }}
                    startIcon={<AddIcon />}
                >
                    New Playlist
                </Button>
            </Box>
        </Box>
    );
};

export default PlaylistResults;
