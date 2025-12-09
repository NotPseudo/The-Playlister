import React, { useContext, useEffect } from "react";
import { Box } from "@mui/material";

import SongSearchTool from "./SongSearchTool";
import SongResults from "./SongResults";
import GlobalStoreContext  from "../store";

import {CreateSongModal, DeleteListModal, DeleteSongModal, EditPlaylistModal, EditSongModal} from './index.js'

const SongsScreen = () => {

    const { store } = useContext(GlobalStoreContext)

    useEffect(() => {
        store.findAndLoadOwnedLists();
        store.clearSongs();
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                height: "calc(100vh - 64px)", 
                width: "100%",
                backgroundColor: "#faf7dc",
                overflow: "hidden"
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
                <SongSearchTool />

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
                    {/* YouTube embed here */}
                </Box>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex"
                }}
            >
                <SongResults />
            </Box>

            <CreateSongModal />
            <EditSongModal />
            <DeleteSongModal />
        </Box>
    );
};

export default SongsScreen;
