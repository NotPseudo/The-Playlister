import React, { useContext, useEffect } from "react";
import { Box } from "@mui/material";

import SongSearchTool from "./SongSearchTool";
import SongResults from "./SongResults";
import { GlobalStoreContextProvider }  from "../store";

const SongsScreen = () => {

    const { store } = useContext(GlobalStoreContextProvider)

    useEffect(() => {
        store.findAndLoadOwnedLists();
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "100%",
                p: 2,
                boxSizing: "border-box",
                backgroundColor: "#faf7dc",
            }}
        >
            <Box
                sx={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                    pr: 2,
                    gap: 3,
                }}
            >
                <SongSearchTool />

                <Box
                    sx={{
                        width: "100%",
                        minHeight: "250px",
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        p: 2,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        boxSizing: "border-box",
                    }}
                >
                    {/* YouTube embed here */}
                </Box>
            </Box>

            <Box
                sx={{
                    width: "60%",
                    pl: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <SongResults />
            </Box>
        </Box>
    );
};

export default SongsScreen;
