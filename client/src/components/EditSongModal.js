import React, { useContext, useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    IconButton,
    Button,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";

export default function EditSongModal({ song }) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const original = {
        title: song?.title || "",
        artist: song?.artist || "",
        year: song?.year || "",
        youTubeId: song?.youTubeId || "",
    };

    const [title, setTitle] = useState(original.title);
    const [artist, setArtist] = useState(original.artist);
    const [year, setYear] = useState(original.year);
    const [youTubeId, setYouTubeId] = useState(original.youTubeId);

    useEffect(() => {
        if (song) {
            setTitle(song.title);
            setArtist(song.artist);
            setYear(song.year);
            setYouTubeId(song.youTubeId);
        }
    }, [song]);

    const handleUpdateTitle = (e) => setTitle(e.target.value);
    const handleUpdateArtist = (e) => setArtist(e.target.value);
    const handleUpdateYear = (e) => setYear(e.target.value);
    const handleUpdateYoutubeId = (e) => setYouTubeId(e.target.value);

    const clearTitle = () => setTitle("");
    const clearArtist = () => setArtist("");
    const clearYear = () => setYear("");
    const clearYoutubeId = () => setYouTubeId("");

    const hasChanges =
        title !== original.title ||
        artist !== original.artist ||
        year !== original.year ||
        youTubeId !== original.youTubeId;

    const handleConfirm = () => {
        if (!hasChanges) return;
        store.editSong(song._id, title, artist, year, youTubeId);
    };

    const handleCancel = () => {
        store.closeEditSong();
    };

    return (
        <Modal open={store.currentModal === "EDIT_SONG"} onClose={handleCancel}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    maxWidth: "900px",
                    bgcolor: "#C8FFC8",
                    borderRadius: "8px",
                    boxShadow: 24,
                    outline: "none",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        bgcolor: "#2E7D32",
                        color: "white",
                        px: 2,
                        py: 1,
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Edit Song
                    </Typography>
                </Box>

                <Box sx={{ px: 4, py: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Title"
                        value={title}
                        onChange={handleUpdateTitle}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={clearTitle}>
                                    <ClearIcon />
                                </IconButton>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Artist"
                        value={artist}
                        onChange={handleUpdateArtist}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={clearArtist}>
                                    <ClearIcon />
                                </IconButton>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Year"
                        value={year}
                        onChange={handleUpdateYear}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={clearYear}>
                                    <ClearIcon />
                                </IconButton>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="YouTube Id"
                        value={youTubeId}
                        onChange={handleUpdateYoutubeId}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={clearYoutubeId}>
                                    <ClearIcon />
                                </IconButton>
                            ),
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        px: 4,
                        pb: 3,
                    }}
                >
                    <Button
                        variant="contained"
                        disabled={!hasChanges}
                        onClick={handleConfirm}
                        sx={{
                            bgcolor: hasChanges ? "#888" : "#cccccc",
                            color: "white",
                            px: 4,
                            py: 1,
                            borderRadius: "10px",
                            "&:hover": {
                                bgcolor: hasChanges ? "#777" : "#cccccc",
                            },
                        }}
                    >
                        Confirm
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCancel}
                        sx={{
                            bgcolor: "#333",
                            color: "white",
                            px: 4,
                            py: 1,
                            borderRadius: "10px",
                            "&:hover": { bgcolor: "#222" },
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
