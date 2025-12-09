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
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";
import ListSongCard from "./ListSongCard";

export default function EditPlaylistModal() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [listName, setListName] = useState(store.editPlaylist?.name || "");

    useEffect(() => {
            if (store.currentModal === "EDIT_LIST" && store.editList) {
                setListName(store.editList.name)
                console.log("Modal opened with list:", store.editList);
            }
        }, [store.currentModal]);

    // Responds to user typing
    const handleUpdateListName = (event) => {
        setListName(event.target.value);
    };

    const handleClearName = () => {
        setListName("");
    };

    const navigate = useNavigate();

    const handleAddSongs = () => {
        store.hideModals();
        navigate("/songs")
    };

    const handleUndo = () => {
        store.undo();
    };

    const handleRedo = () => {
        store.redo();
    };

    const handleClose = () => {
        store.hideModals();
    };

    const handleKeyDown = (e) => {


        if (e.key === "Enter" && listName !== "") store.editListChangeName(listName);


    }

    return (
        <Modal open={store.currentModal === "EDIT_LIST"}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    bgcolor: "#d4ffcf",
                    borderRadius: 2,
                    boxShadow: 24,
                    outline: "none",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: 600  
                }}
            >
                <Box
                    sx={{
                        bgcolor: "#2e7d32",
                        color: "white",
                        p: 2,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        fontSize: "1.6rem",
                        fontWeight: 700,
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
                            onKeyDown={handleKeyDown}
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

                    {store.editList?.songs?.map((song, index) => (
                        <ListSongCard key={song._id} song={song} index={index}></ListSongCard>
                    ))}
                </Box>

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
                            disabled={!store.canUndo()}
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
                            disabled={!store.canRedo()}
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
