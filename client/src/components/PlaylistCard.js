import React, { useContext, useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Button,
    IconButton,
    Collapse
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import AuthContext from '../auth/';
import { GlobalStoreContext } from '../store/';

const PlaylistCard = ({ playlist }) => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [isExpanded, setExpanded] = useState(false);

    const userIsOwner = auth.loggedIn && auth.user?._id === playlist.owner._id; 
    const userLoggedIn = auth.loggedIn;

    const handleExpand = () => setExpanded(true);
    const handleClose = () => setExpanded(false);

    const handlePlay = () => {
        store.openListInPlayer(playlist);
    };

    const handleCopy = () => {
        store.duplicateList(playlist);
    };

    const handleEdit = () => {
        store.setEditList(playlist);
    };

    const handleDelete = () => {
        store.markListForDeletion(playlist);
    };

    return (
        <Box
            sx={{
                width: "97%",
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                p: 2,
                mb: 3,
                boxShadow: "0px 2px 6px rgba(0,0,0,0.15)"
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                        src={playlist.owner.avatar}
                        sx={{ width: 55, height: 55 }}
                    />
                    <Box>
                        <Typography sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
                            {playlist.name}
                        </Typography>

                        <Typography sx={{ color: "gray", fontSize: ".9rem" }}>
                            {playlist.owner.username}
                        </Typography>

                        <Typography sx={{ color: "#3f6ee9", fontSize: ".85rem", mt: 0.5 }}>
                            {playlist.uniqueListeners} Listeners
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>

                    {userIsOwner && (
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#c62828",
                                ":hover": { backgroundColor: "#e53935" }
                            }}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    )}

                    {userIsOwner && (
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#3949ab",
                                ":hover": { backgroundColor: "#5c6bc0" }
                            }}
                            onClick={handleEdit}
                        >
                            Edit
                        </Button>
                    )}

                    {userLoggedIn && (
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#2e7d32",
                                ":hover": { backgroundColor: "#43a047" }
                            }}
                            onClick={handleCopy}
                        >
                            Copy
                        </Button>
                    )}

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#d81b60",
                            ":hover": { backgroundColor: "#e91e63" }
                        }}
                        onClick={handlePlay}
                    >
                        Play
                    </Button>

                    <IconButton onClick={isExpanded ? handleClose : handleExpand}>
                        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={isExpanded}>
                <Box
                    sx={{
                        mt: 2,
                        borderTop: "1px solid rgba(0,0,0,0.2)",
                        pt: 2
                    }}
                >
                    {playlist.songs.map((song, index) => (
                        <Typography key={song.id} sx={{ mb: 0.5 }}>
                            {index + 1}. {song.title} by {song.artist} ({song.year})
                        </Typography>
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
};

export default PlaylistCard;
