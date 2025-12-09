import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";

export default function PlayerSongCard({ song, index, onclick }) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const handleClick = () => {
        console.log("inside handle click: "+ song.youTubeId)
        onclick(index);
    };

    return (
        <Box
            onClick={handleClick}
            sx={{
                bgcolor: "#fff8b3",    
                border: "3px solid black",
                borderRadius: "12px",
                padding: "10px 16px",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                    transform: "scale(1.02)",
                    bgcolor: "#fff2a6"
                },
                display: "flex",
                alignItems: "center",
                userSelect: "none"
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "black"
                }}
            >
                {index + 1}. {song.title} by {song.artist} ({song.year})
            </Typography>
        </Box>
    );
}
