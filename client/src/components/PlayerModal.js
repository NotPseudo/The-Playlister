import React, { useContext, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Avatar,
    IconButton,
    Divider,
    Button
} from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import CloseIcon from "@mui/icons-material/Close";

import AuthContext from "../auth";
import GlobalStoreContext from "../store";

export default function PlayerModal({ open, onClose }) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [playingStatus, setPlayingStatus] = useState("PAUSED");

    // ------------------------------
    // Button Handlers
    // ------------------------------
    const handlePlayButtonClick = () => {
        if (playingStatus === "PAUSED") {
            setPlayingStatus("PLAYING");
            store.playCurrentSong();
        } else {
            setPlayingStatus("PAUSED");
            store.pauseCurrentSong();
        }
    };

    const handleSkip = () => {
        store.playNextSong();
    };

    const handlePrevious = () => {
        store.playPreviousSong();
    };

    const handleClose = () => {
        setPlayingStatus("PAUSED");
        store.pauseCurrentSong();
        onClose();
    };

    // ------------------------------
    // Playlist + Song Data
    // ------------------------------
    const playlist = store.currentPlaylist;
    const songs = playlist?.songs || [];

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    height: "80%",
                    bgcolor: "#d6fccc",
                    outline: "3px solid black",
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {/* ---------------- HEADER BAR ---------------- */}
                <Box
                    sx={{
                        bgcolor: "#2e7d32", // green header
                        color: "white",
                        padding: "10px 20px",
                        fontSize: "22px",
                        fontWeight: "bold",
                    }}
                >
                    Play Playlist
                </Box>

                {/* ---------------- MAIN CONTENT ROW ---------------- */}
                <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>

                    {/* ---------- LEFT SIDE (65%) ---------- */}
                    <Box
                        sx={{
                            width: "65%",
                            padding: 2,
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        {/* Playlist Info Row */}
                        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                            <Avatar
                                src={playlist?.ownerAvatar}
                                sx={{ width: 48, height: 48, marginRight: 2 }}
                            />
                            <Box>
                                <Typography variant="h6">{playlist?.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {playlist?.ownerUsername}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Scrollable Song List */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                overflowY: "auto",
                                paddingRight: "8px"
                            }}
                        >
                            {songs.map((song, index) => (
                                <Box key={song._id} sx={{ mb: 1 }}>
                                    {/* PlayerSongCard JSX goes here later */}
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* ---------- RIGHT SIDE (35%) ---------- */}
                    <Box
                        sx={{
                            width: "35%",
                            padding: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        {/* YouTube Player */}
                        <Box
                            sx={{
                                width: "100%",
                                height: "50%",
                                backgroundColor: "#f0e4ff",
                                borderRadius: "6px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                mb: 3,
                                overflow: "hidden"
                            }}
                        >
                            {store.currentSong && (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${store.currentSong.youTubeId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </Box>

                        {/* Player Controls */}
                        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                            <IconButton
                                onClick={handlePrevious}
                                sx={{
                                    bgcolor: "#d9d9d9",
                                    border: "2px solid black",
                                    width: 60,
                                    height: 60
                                }}
                            >
                                <SkipPreviousIcon fontSize="large" />
                            </IconButton>

                            <IconButton
                                onClick={handlePlayButtonClick}
                                sx={{
                                    bgcolor: "#d9d9d9",
                                    border: "2px solid black",
                                    width: 60,
                                    height: 60
                                }}
                            >
                                {playingStatus === "PAUSED" ? (
                                    <PlayArrowIcon fontSize="large" />
                                ) : (
                                    <PauseIcon fontSize="large" />
                                )}
                            </IconButton>

                            <IconButton
                                onClick={handleSkip}
                                sx={{
                                    bgcolor: "#d9d9d9",
                                    border: "2px solid black",
                                    width: 60,
                                    height: 60
                                }}
                            >
                                <SkipNextIcon fontSize="large" />
                            </IconButton>
                        </Box>

                        {/* Close Button */}
                        <Button
                            variant="contained"
                            onClick={handleClose}
                            sx={{
                                bgcolor: "#2e7d32",
                                ":hover": { bgcolor: "#1b5e20" },
                                borderRadius: "40px",
                                width: "120px",
                                height: "45px",
                                fontSize: "16px"
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
