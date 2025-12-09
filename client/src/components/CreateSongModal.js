import React, { useContext, useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    InputAdornment,
    Button,
    Modal
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AuthContext from "../auth";
import { GlobalStoreContext,  } from "../store";

export default function CreateSongModal() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [year, setYear] = useState("");
    const [youTubeId, setYouTubeId] = useState("");

    const handleUpdateTitle = (e) => setTitle(e.target.value);
    const handleUpdateArtist = (e) => setArtist(e.target.value);
    const handleUpdateYear = (e) => setYear(e.target.value);
    const handleUpdateYoutubeId = (e) => setYouTubeId(e.target.value);

    const clearTitle = () => setTitle("");
    const clearArtist = () => setArtist("");
    const clearYear = () => setYear("");
    const clearYoutubeId = () => setYouTubeId("");

    const handleConfirm = () => {
        store.sendCreateNewSong(title, artist, year, youTubeId);
        clearFields();
    };

    const handleCancel = () => {
        clearFields();
        store.hideModals();
    };

    const clearFields = () => {
        clearTitle();
        clearArtist();
        clearYear();
        clearYoutubeId();
    }

    const renderInput = (label, value, onChange, onClear) => (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            //onKeyDown={handleKeyDown}
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

    const hasEmpty = title === "" || artist === "" || year === "" || youTubeId === "";

    return (
        <Modal open={store.currentModal === "CREATE_SONG"}>
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
                        Create Song
                    </Typography>
                </Box>

                <Box sx={{ px: 4, py: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                    {renderInput("Title", title, handleUpdateTitle, clearTitle)}
                    {renderInput("Artist", artist, handleUpdateArtist, clearArtist)}
                    {renderInput("Year", year, handleUpdateYear, clearYear)}
                    {renderInput("YouTubeId", youTubeId, handleUpdateYoutubeId, clearYoutubeId)}
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
                        disabled={hasEmpty}
                        onClick={handleConfirm}
                        sx={{
                            bgcolor: !hasEmpty ? "#333" : "#888",
                            color: "white",
                            px: 4,
                            py: 1,
                            borderRadius: "10px",
                            "&:hover": {
                                bgcolor: !hasEmpty ? "#777" : "#cccccc",
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
