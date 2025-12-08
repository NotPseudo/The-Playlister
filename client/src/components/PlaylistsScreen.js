import React, { useContext, useEffect } from "react";
import { Box } from "@mui/material";
import PlaylistSearchTool from "../components/PlaylistSearchTool";
import PlaylistResults from "../components/PlaylistResults";
import { GlobalStoreContextProvider } from "../store";

const PlaylistsScreen = () => {

    const { store } = useContext(GlobalStoreContextProvider)

    useEffect(() => {
        store.findAndLoadOwnedLists();
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                height: "calc(100vh - 64px)", // subtract AppBanner height
                width: "100%",
            }}
        >
            {/* LEFT: Search Tool */}
            <Box
                sx={{
                    width: "35%",        // matches your mockup proportions
                    minWidth: 320,       // ensures layout doesn't collapse
                    borderRight: "2px solid rgba(0,0,0,0.15)",
                    p: 3,
                    boxSizing: "border-box",
                    backgroundColor: "#faf7df", // same background tone as screenshot
                }}
            >
                <PlaylistSearchTool />
            </Box>

            {/* RIGHT: Results */}
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
        </Box>
    );
};

export default PlaylistsScreen;
