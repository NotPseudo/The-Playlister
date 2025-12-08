import React, { useContext, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Menu,
    MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import AuthContext from '../auth/';
import { GlobalStoreContext, SongSortType } from '../store/';

import CatalogSongCard from "./CatalogSongCard";

const SongResults = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [anchor, setAnchor] = useState(null);
    const [sortTypeDisplay, setSortTypeDisplay] = useState("Listens (Hi-Lo)");

    const handleSortTypeListOpen = (event) => {
        setAnchor(event.currentTarget);
    };

    const handleSort = (text, sortType) => {
        setSortTypeDisplay(text);
        store.setSongSortOrder(sortType);
        setAnchor(null);
    };

    const handleListensHiLo = () => handleSort("Listens (Hi-Lo)", SongSortType.LISTENS_HILO);
    const handleListensLoHi = () => handleSort("Listens (Lo-Hi)", SongSortType.LISTENS_LOHI);

    const handleListsHiLo = () => handleSort("Playlists (Hi-Lo)", SongSortType.NUMLISTS_HILO);
    const handleListsLoHi = () => handleSort("Playlists (Lo-Hi)", SongSortType.NUMLISTS_LOHI);

    const handleTitleAZ = () => handleSort("Title A-Z", SongSortType.TITLE_AZ);
    const handleTitleZA = () => handleSort("Title Z-A", SongSortType.TITLE_ZA);

    const handleArtistAZ = () => handleSort("Artist A-Z", SongSortType.ARTIST_AZ);
    const handleArtistZA = () => handleSort("Artist Z-A", SongSortType.ARTIST_ZA);

    const handleYearHiLo = () => handleSort("Year (Hi-Lo)", SongSortType.YEAR_HILO);
    const handleYearLoHi = () => handleSort("Year (Lo-Hi)", SongSortType.YEAR_LOHI);

    const handleNewSong = () => {
        store.createNewSong();
    };

    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "1.3rem", fontWeight: 600 }}>
                        Sort:
                    </Typography>

                    <Button
                        onClick={handleSortTypeListOpen}
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                            textTransform: "none",
                            fontSize: "1.2rem",
                            color: "#3f6ee9",
                        }}
                    >
                        {sortTypeDisplay}
                    </Button>

                    <Menu
                        anchorEl={anchor}
                        open={Boolean(anchor)}
                        onClose={() => setAnchor(null)}
                    >
                        <MenuItem onClick={handleListensHiLo}>Listens Hi - Lo</MenuItem>
                        <MenuItem onClick={handleListensLoHi}>Listens Lo - Hi</MenuItem>
                        <MenuItem onClick={handleListsHiLo}>Playlists Hi - Lo</MenuItem>
                        <MenuItem onClick={handleListsLoHi}>Playlists Lo - Hi</MenuItem>
                        <MenuItem onClick={handleTitleAZ}>Title A - Z</MenuItem>
                        <MenuItem onClick={handleTitleZA}>Title Z - A</MenuItem>
                        <MenuItem onClick={handleArtistAZ}>Artist A - Z</MenuItem>
                        <MenuItem onClick={handleArtistZA}>Artist Z - A</MenuItem>
                        <MenuItem onClick={handleYearHiLo}>Year Hi - Lo</MenuItem>
                        <MenuItem onClick={handleYearLoHi}>Year Lo - Hi</MenuItem>
                    </Menu>
                </Box>

                <Typography sx={{ fontSize: "1.3rem", fontWeight: 600 }}>
                    {store.songResults.length} Songs
                </Typography>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    pr: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {store.songs.map((song) => (
                    <CatalogSongCard key={song._id} song={song} />
                ))}
            </Box>

            <Box sx={{ mt: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewSong}
                    sx={{
                        backgroundColor: "#5f3bbb",
                        borderRadius: "30px",
                        px: 4,
                        py: 1.5,
                        ":hover": { backgroundColor: "#7a4fdd" }
                    }}
                >
                    New Song
                </Button>
            </Box>
        </Box>
    );
};

export default SongResults;
