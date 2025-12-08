import React, { useContext } from "react";
import { AuthContext } from "../auth";
import { GlobalStoreContext } from "../store";

import {
    Box,
    Typography,
    IconButton,
    Paper
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";

export default function ListSongCard({ song, index }) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const handleDuplicate = (event) => {
        event.stopPropagation();
        store.addDuplicateTransaction(song, index + 1);
    };

    const handleRemove = (event) => {
        event.stopPropagation();
        store.addRemoveSongFromListTransaction(song, index);
    };

    return (
        <Paper
            elevation={2}
            sx={{
                width: "100%",
                backgroundColor: "#FFF7C2",
                borderRadius: "8px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
                cursor: "grab"
            }}
        >
            <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
            >
                {index + 1}. {song.title} by {song.artist} ({song.year})
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                    onClick={handleDuplicate}
                    size="large"
                    sx={{
                        color: "black",
                        "&:hover": { backgroundColor: "#e5dede" }
                    }}
                >
                    <ContentCopyIcon fontSize="inherit" />
                </IconButton>

                <IconButton
                    onClick={handleRemove}
                    size="large"
                    sx={{
                        color: "black",
                        "&:hover": { backgroundColor: "#e5dede" }
                    }}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </Box>
        </Paper>
    );
}
