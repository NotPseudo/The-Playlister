import React, { useContext, useEffect, useState, useRef } from "react";
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

import YouTube from 'react-youtube'

import PlayerSongCard from "./PlayerSongCard";

import AuthContext from "../auth";
import GlobalStoreContext from "../store";

export default function PlayerModal() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [playingStatus, setPlayingStatus] = useState("PAUSED");
    const [index, setIndex] = useState(0);
    const [songId, setSongId] = useState("");

    const [player, setPlayer] = useState(null);

    const onReady = (event) => {
        setPlayer(event.target);
    };

    const handlePlayButtonClick = () => {
        if (playingStatus === "PAUSED") {
            setPlayingStatus("PLAYING");
            //player.playVideo();
        } else {
            setPlayingStatus("PAUSED");
            //player.pauseVideo();
        }
    };

    let playlist = store.playingList;

    const setPlaying = (index) => {
        console.log("Inside setPlaying")
        setSongId(playlist.songs[index].youTubeId);
        store.setCatalogPlayingSong(playlist.songs[index]);
        console.log("songId: " + songId)
        setIndex(index);
    }

    const handleSkip = () => {
        let newIndex = (index + 1) % playlist.songs.length;
        setPlaying(newIndex);
    };

    const handlePrevious = () => {
        let newIndex = (((index - 1) % playlist.songs.length) + playlist.songs.length) % playlist.songs.length;
        setPlaying(newIndex)
    };

    const handleClose = () => {
        setPlayingStatus("PAUSED");
        store.closePlayingList();
    };

    const handleVidEnd = () => {
        handleSkip();
    }

    const opts = {
      height: '310',
      width: '690',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };

    return (
        <Modal open={store.currentModal === "PLAYER"} onClose={handleClose}>
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
                <Box
                    sx={{
                        bgcolor: "#2e7d32",
                        color: "white",
                        padding: "10px 20px",
                        fontSize: "22px",
                        fontWeight: "bold",
                    }}
                >
                    Play Playlist
                </Box>

                <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>

                    <Box
                        sx={{
                            width: "50%",
                            padding: 2,
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                            <Avatar
                                src={store.playingList?.owner.avatar}
                                sx={{ width: 48, height: 48, marginRight: 2 }}
                            />
                            {/* {console.log("in return: " + JSON.stringify(store.playingList))}; */}
                            <Box>
                                <Typography variant="h6">{store.playingList?.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {store.playingList?.owner.username}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Box
                            sx={{
                                flexGrow: 1,
                                overflowY: "auto",
                                paddingRight: "8px"
                            }}
                        >
                            {store.playingList?.songs?.map((song, index) => (
                                <Box key={song._id} sx={{ mb: 1 }}>
                                    <PlayerSongCard song={song} index={index} onclick={setPlaying} onReady={onReady}/>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            width: "50%",
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
                            {console.log("Right before youtube: " + songId)}
                            
                            <YouTube videoId={songId} onEnd={handleVidEnd} opts={opts}/>
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
