import React, { useContext } from "react";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";

import {
    Modal,
    Box,
    Typography,
    Button
} from "@mui/material";

export default function DeleteListModal() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const handleConfirm = (event) => {
        event.stopPropagation();
        store.deleteMarkedSong(); 
    };

    const handleCancel = (event) => {
        event.stopPropagation();
        store.hideModals();
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60vw",
        maxWidth: 700,
        bgcolor: "#ccffcc",
        borderRadius: "8px",
        boxShadow: 24,
        p: 0,
        outline: "none",
    };

    return (
        <Modal
            open={store.currentModal == "DELETE_LIST"}
            onClose={handleCancel}
        >
            <Box sx={style}>

                <Box
                    sx={{
                        width: "100%",
                        bgcolor: "green",
                        color: "white",
                        fontSize: "1.6rem",
                        fontWeight: "bold",
                        p: 1.5,
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px"
                    }}
                >
                    Delete Playlist
                </Box>

                <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography
                        variant="h4"
                        sx={{ mb: 2, fontWeight: "bold" }}
                    >
                        Are you sure you want to delete the{" "}
                        {store.deleteList?.name} playlist?
                    </Typography>

                    <Typography variant="h6" sx={{ mb: 5 }}>
                        Doing so means it will be permanently removed.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            mt: 4
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleConfirm}
                            sx={{
                                bgcolor: "black",
                                color: "white",
                                px: 4,
                                py: 1.5,
                                fontSize: "1.1rem",
                                borderRadius: 3,
                                "&:hover": { bgcolor: "#333" }
                            }}
                        >
                            Delete Playlist
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleCancel}
                            sx={{
                                bgcolor: "black",
                                color: "white",
                                px: 4,
                                py: 1.5,
                                fontSize: "1.1rem",
                                borderRadius: 3,
                                "&:hover": { bgcolor: "#333" }
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>

            </Box>
        </Modal>
    );
}
