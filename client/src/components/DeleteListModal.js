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
        store.deleteMarkedList(); 
    };

    const handleCancel = (event) => {
        event.stopPropagation();
        store.hideModals();
    };

    return (
        <Modal
            open={store.currentModal == "DELETE_LIST"}
            onClose={handleCancel}
        >
            <Box sx={{
                position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    bgcolor: "#d4ffcf",
                    borderRadius: 2,
                    boxShadow: 24,
                    outline: "none",
            }}>

                <Box
                    sx={{
                        bgcolor: "#2e7d32",
                        color: "white",
                        p: 2,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        fontSize: "1.6rem",
                        fontWeight: 700,
                    }}
                >
                    Delete Playlist
                </Box>

                <Box sx={{ p: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 700,
                            mb: 2,
                            lineHeight: 1.3, }}
                    >
                        Are you sure you want to delete the{" "}
                        {store.deleteList?.name} playlist?
                    </Typography>

                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
                        Doing so means it will be permanently removed.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleConfirm}
                            sx={{
                                bgcolor: "#1b5e20",
                                color: "white",
                                px: 4,
                                py: 1.2,
                                fontSize: "1.2rem",
                                borderRadius: 3,
                                "&:hover": {
                                    bgcolor: "#144a18",
                                }
                            }}
                        >
                            Delete Playlist
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleCancel}
                            sx={{
                                bgcolor: "#333",
                                color: "white",
                                px: 4,
                                py: 1.2,
                                fontSize: "1.2rem",
                                borderRadius: 3,
                                "&:hover": {
                                    bgcolor: "#222",
                                }
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
