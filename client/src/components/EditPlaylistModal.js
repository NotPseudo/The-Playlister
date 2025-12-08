import React, { useContext, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    IconButton,
    Button,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import AddIcon from "@mui/icons-material/Add";

import { AuthContext } from "../auth";
import { GlobalStoreContext } from "../store";

export default function EditPlaylistModal({ open, onClose, playlist }) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [listName, setListName] = useState(playlist?.name || "");

    // Responds to user typing
    const handleUpdateListName = (event) => {
        setListName(event.target.value);
    };

    const handleClearName = () => {
        setListName("");
    };

    const handleAddSongs = () => {
        store.goToSongCatalogFromPlaylist(playlist._id);
    };

    const handleUndo = () => {
        store.undoPlaylistChange(playlist._id);
    };

    const handleRedo = () => {
        store.redoPlaylistChange(playlist._id);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal open={store.currentModal === "EDIT_LIST"} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    maxWidth: "900px",
                    bgcolor: "#ccffcc",
                    borderRadius: "8px",
                    boxShadow: 24,
                    outline: "none",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* HEADER BAR */}
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
                        Edit Playlist
                    </Typography>
                </Box>

                {/* NAME + ADD SONGS BUTTON */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2,
                        py: 2,
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Playlist Name"
                            value={listName}
                            onChange={handleUpdateListName}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={handleClearName}>
                                        <ClearIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>

                    {/* ADD SONGS BUTTON */}
                    <Button
                        onClick={handleAddSongs}
                        sx={{
                            ml: 2,
                            bgcolor: "#6A4FB6",
                            color: "white",
                            px: 2,
                            py: 1,
                            borderRadius: "16px",
                            "&:hover": { bgcolor: "#5a3fa3" },
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <AddIcon sx={{ mr: 1 }} />
                        <LibraryMusicIcon />
                    </Button>
                </Box>

                {/* SCROLLABLE SONG LIST AREA */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                        px: 2,
                        pb: 2,
                    }}
                >
                    {/*  
                        ListSongCard components go here  
                        (You said not to include their JSX yet)
                    */}

                    {playlist?.songs?.map((song, index) => (
                        <div key={song._id}>
                            {/* Placeholder — will fill in later */}
                            <Typography>
                                {index + 1}. {song.title} ({song.year})
                            </Typography>
                        </div>
                    ))}
                </Box>

                {/* FOOTER BUTTONS */}
                <Box
                    sx={{
                        px: 2,
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            onClick={handleUndo}
                            variant="contained"
                            sx={{
                                bgcolor: "#6A4FB6",
                                "&:hover": { bgcolor: "#5a3fa3" },
                            }}
                            startIcon={<UndoIcon />}
                        >
                            Undo
                        </Button>

                        <Button
                            onClick={handleRedo}
                            variant="contained"
                            sx={{
                                bgcolor: "#6A4FB6",
                                "&:hover": { bgcolor: "#5a3fa3" },
                            }}
                            startIcon={<RedoIcon />}
                        >
                            Redo
                        </Button>
                    </Box>

                    <Button
                        onClick={handleClose}
                        variant="contained"
                        sx={{
                            bgcolor: "#2E7D32",
                            "&:hover": { bgcolor: "#256628" },
                            px: 3,
                            borderRadius: "16px",
                        }}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
