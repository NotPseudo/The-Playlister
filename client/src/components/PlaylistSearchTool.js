import React, { useState, useContext } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    InputAdornment,
    Button
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

import AuthContext from '../auth/';
import { GlobalStoreContext } from '../store/';

const PlaylistSearchTool = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [listName, setListName] = useState("");
    const [userName, setUserName] = useState("");
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [year, setYear] = useState("");

    // --- INPUT HANDLERS ---
    const handleUpdateListName = (e) => setListName(e.target.value);
    const handleClearListName = () => setListName("");

    const handleUpdateUserName = (e) => setUserName(e.target.value);
    const handleClearUserName = () => setUserName("");

    const handleUpdateTitle = (e) => setTitle(e.target.value);
    const handleClearTitle = () => setTitle("");

    const handleUpdateArtist = (e) => setArtist(e.target.value);
    const handleClearArtist = () => setArtist("");

    const handleUpdateYear = (e) => setYear(e.target.value);
    const handleClearYear = () => setYear("");

    const handleSearch = () => {
        store.searchAndLoadLists(
            listName,
            userName,
            title,
            artist,
            year,
        );
    };

    const handleClear = () => {
        setListName("");
        setUserName("");
        setTitle("");
        setArtist("");
        setYear("");

        store.findAndLoadOwnedLists();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    }

    const renderInput = (label, value, onChange, onClear) => (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            fullWidth
            sx={{
                mb: 3,
                backgroundColor: "#e3ddea",
                borderRadius: "6px"
            }}
            InputProps={{
                endAdornment: value && (
                    <InputAdornment position="end">
                        <IconButton onClick={onClear}>
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );

    return (
        <Box sx={{ width: "100%" }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    color: "#b213c2",
                    mb: 4
                }}
            >
                Playlists
            </Typography>

            {renderInput("by Playlist Name", listName, handleUpdateListName, handleClearListName)}
            {renderInput("by User Name", userName, handleUpdateUserName, handleClearUserName)}
            {renderInput("by Song Title", title, handleUpdateTitle, handleClearTitle)}
            {renderInput("by Song Artist", artist, handleUpdateArtist, handleClearArtist)}
            {renderInput("by Song Year", year, handleUpdateYear, handleClearYear)}

            <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    sx={{
                        backgroundColor: "#6e3caf",
                        borderRadius: "30px",
                        px: 4,
                        py: 1.5,
                        ":hover": { backgroundColor: "#8d5cd0" }
                    }}
                >
                    Search
                </Button>

                <Button
                    variant="contained"
                    onClick={handleClear}
                    sx={{
                        backgroundColor: "#6e3caf",
                        borderRadius: "30px",
                        px: 4,
                        py: 1.5,
                        ":hover": { backgroundColor: "#8d5cd0" }
                    }}
                >
                    Clear
                </Button>
            </Box>
        </Box>
    );
};

export default PlaylistSearchTool;
