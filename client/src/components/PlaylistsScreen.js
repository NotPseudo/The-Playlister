import React, { useContext, useEffect } from "react";
import { Box } from "@mui/material";
import PlaylistSearchTool from "../components/PlaylistSearchTool";
import PlaylistResults from "../components/PlaylistResults";
import GlobalStoreContext from "../store";

import {CreateSongModal, DeleteListModal, DeleteSongModal, EditPlaylistModal, EditSongModal, PlayerModal} from './index.js'

const PlaylistsScreen = () => {

    const { store } = useContext(GlobalStoreContext)

    useEffect(() => {
        store.findAndLoadOwnedLists();
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                height: "calc(100vh - 64px)", 
                width: "100%",
            }}
        >
            <Box
                sx={{
                    width: "40%",        
                    minWidth: 320,       
                    borderRight: "2px solid rgba(0,0,0,0.15)",
                    p: 3,
                    boxSizing: "border-box",
                    backgroundColor: "#faf7df", 
                }}
            >
                <PlaylistSearchTool />
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    p: 3,
                    boxSizing: "border-box",
                    backgroundColor: "#faf7df",
                    overflowY: "auto",
                }}
            >
                <PlaylistResults />
            </Box>

            <DeleteListModal/>
            <EditPlaylistModal/>
            <PlayerModal/>
        </Box>
    );
};

export default PlaylistsScreen;
