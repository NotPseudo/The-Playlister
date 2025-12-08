import React, { useContext, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
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

            <Box sx={{ position: "relative", mb: 2 }}>
                <TextField
                    fullWidth
                    placeholder="by Title"
                    size="small"
                    value={title}
                    onChange={handleUpdateTitle}
                    sx={{
                        backgroundColor: "#e8e0eb",
                        borderRadius: "8px"
                    }}
                />
                <IconButton
                    onClick={handleClearTitle}
                    sx={{
                        position: "absolute",
                        right: 5,
                        top: "50%",
                        transform: "translateY(-50%)"
                    }}
                >
                    <ClearIcon />
                </IconButton>
            </Box>

            <Box sx={{ position: "relative", mb: 2 }}>
                <TextField
                    fullWidth
                    placeholder="by Artist"
                    size="small"
                    value={artist}
                    onChange={handleUpdateArtist}
                    sx={{
                        backgroundColor: "#e8e0eb",
                        borderRadius: "8px"
                    }}
                />
                <IconButton
                    onClick={handleClearArtist}
                    sx={{
                        position: "absolute",
                        right: 5,
                        top: "50%",
                        transform: "translateY(-50%)"
                    }}
                >
                    <ClearIcon />
                </IconButton>
            </Box>

            <Box sx={{ position: "relative", mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="by Year"
                    size="small"
                    value={year}
                    onChange={handleUpdateYear}
                    sx={{
                        backgroundColor: "#e8e0eb",
                        borderRadius: "8px"
                    }}
                />
                <IconButton
                    onClick={handleClearYear}
                    sx={{
                        position: "absolute",
                        right: 5,
                        top: "50%",
                        transform: "translateY(-50%)"
                    }}
                >
                    <ClearIcon />
                </IconButton>
            </Box>

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
