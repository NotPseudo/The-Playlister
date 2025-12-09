import React, { useContext, useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    IconButton,
    Button,
    InputAdornment
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";

export default function EditSongModal() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [original, setOriginal] = useState(null);

const [title, setTitle] = useState("");
const [artist, setArtist] = useState("");
const [year, setYear] = useState("");
const [youTubeId, setYouTubeId] = useState("");

    useEffect(() => {
        if (store.currentModal === "EDIT_SONG" && store.editSong) {
            setOriginal({ ...store.editSong });
            setTitle(store.editSong.title);
            setArtist(store.editSong.artist);
            setYear(store.editSong.year);
            setYouTubeId(store.editSong.youTubeId);
            console.log("Modal opened with song:", store.editSong);
console.log("Loaded original:", original);
        }
    }, [store.currentModal]);

    const handleUpdateTitle = (e) => setTitle(e.target.value);
    const handleUpdateArtist = (e) => setArtist(e.target.value);
    const handleUpdateYear = (e) => setYear(e.target.value);
    const handleUpdateYoutubeId = (e) => setYouTubeId(e.target.value);

    const clearTitle = () => setTitle("");
    const clearArtist = () => setArtist("");
    const clearYear = () => setYear("");
    const clearYoutubeId = () => setYouTubeId("");

    const hasChanges = original && (
        title !== original.title ||
        artist !== original.artist ||
        year !== original.year ||
        youTubeId !== original.youTubeId
    );
        

    const handleConfirm = () => {
        if (!hasChanges) {
            console.log("No changes")
            return;
        }
        store.performEditSong(original._id, title, artist, year, youTubeId);
    };

    const handleCancel = () => {
        store.closeEditSong();
    };

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
                        disabled={!hasChanges}
                        onClick={handleConfirm}
                        sx={{
                            bgcolor: hasChanges ? "#333" : "#cccccc",
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
