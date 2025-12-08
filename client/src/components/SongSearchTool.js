import React, { useContext, useState } from "react";
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

const SongSearchTool = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [year, setYear] = useState("");

    const handleUpdateTitle = (e) => setTitle(e.target.value);
    const handleUpdateArtist = (e) => setArtist(e.target.value);
    const handleUpdateYear = (e) => setYear(e.target.value);

    const handleClearTitle = () => setTitle("");
    const handleClearArtist = () => setArtist("");
    const handleClearYear = () => setYear("");

    const handleSearch = () => {
        store.searchAndLoadSongs({ title, artist, year });
    };

    // const handleClear = () => {
    //     setTitle("");
    //     setArtist("");
    //     setYear("");
    // };

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
                sx={{
                    fontSize: "2.3rem",
                    fontWeight: 700,
                    mb: 2,
                    color: "#b400c5"
                }}
            >
                Song Search
            </Typography>

            {renderInput("by Title", title, handleUpdateTitle, handleClearTitle)}
            {renderInput("by Artist", artist, handleUpdateArtist, handleClearArtist)}
            {renderInput("by Year", year, handleUpdateYear, handleClearYear)}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    gap: 3,
                    mt: 1
                }}
            >
                <Button
                    onClick={handleSearch}
                    variant="contained"
                    startIcon={<SearchIcon />}
                    sx={{
                        backgroundColor: "#5f3bbb",
                        borderRadius: "30px",
                        px: 4,
                        py: 1.5,
                        ":hover": { backgroundColor: "#7a4fdd" }
                    }}
                >
                    Search
                </Button>

                {/* <Button
                    onClick={handleClear}
                    variant="contained"
                    sx={{
                        backgroundColor: "#5f3bbb",
                        borderRadius: "30px",
                        px: 4,
                        py: 1.5,
                        ":hover": { backgroundColor: "#7a4fdd" }
                    }}
                >
                    Clear
                </Button> */}
            </Box>
        </Box>
    );
};

export default SongSearchTool;
