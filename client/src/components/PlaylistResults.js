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

    const handleSort = (text, sortType) => {
        setSortTypeDisplay(text);
        store.setListSortOrder(sortType);
        setAnchor(null);
    };

    const handleListenersHiLo = () => handleSort("Listeners (Hi-Lo)", ListSortType.LISTENERS_HILO);

    const handleListenersLoHi = () => handleSort("Listeners (Lo-Hi)", ListSortType.LISTENERS_LOHI);

    const handleNameAZ = () => handleSort("Playlist Name (A-Z)", ListSortType.NAME_AZ);

    const handleNameZA = () => handleSort("Playlist Name (Z-A)", ListSortType.NAME_ZA);

    const handleOwnerNameAZ = () => handleSort("Owner Username (A-Z)", ListSortType.USERNAME_AZ);

    const handleOwnerNameZA = () => handleSort("Owner Username (Z-A)", ListSortType.USERNAME_ZA);

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
