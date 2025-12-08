import React, { useState, useContext, useRef, useEffect } from "react";
import {
    Avatar,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import AuthContext from '../auth/';
import { GlobalStoreContext } from '../store/';
import Copyright from "./Copyright";

const EditAccountScreen = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { auth } = useContext(AuthContext);

    const [username, setUsername] = useState(auth.user?.username || "");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [avatar, setAvatar] = useState(auth.user?.avatar || null);

    const [errorText, setErrorText] = useState("");
    
        useEffect(() => {
            if (auth.error) setErrorText(auth.error);
        }, [auth.error])

    const handleSelectAvatar = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const img = new Image();
        img.onload = () => {
            if (img.width != 250 || img.height != 250) {
                event.target.value = "";
                setErrorText("Image resolution must be 250x250")
                return;
            }
            setAvatar(URL.createObjectURL(file));
        };
        img.src = URL.createObjectURL(file);
    };

    const handleComplete = async () => {
        let res = await auth.editAccount(username, avatar, password, confirm)
        if (res) {
            navigate(-1);
        } else {
            // LET USER KNOW
        }
    };

    const handleCancel = () => {
        navigate("/playlists");
    };

    return (
        <Box
            sx={{
                mt: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <LockOutlinedIcon sx={{ fontSize: 60, mb: 2 }} />

            <Typography variant="h4" sx={{ mb: 4 }}>
                Edit Account
            </Typography>

            <Box sx={{ mb: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar
                    src={avatar}
                    sx={{
                        width: 90,
                        height: 90,
                        mb: 1,
                        border: "2px solid #ccc",
                        cursor: "pointer"
                    }}
                />
                <Button
                    variant="contained"
                    component="label"
                    sx={{ backgroundColor: "#555", ":hover": { backgroundColor: "#777" } }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    Select Image
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleSelectAvatar}
                    />
                </Button>
            </Box>

            <TextField
                label="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ width: 350, mb: 2 }}
                InputProps={{
                    endAdornment: username ? (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setUsername("")}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ) : null
                }}
            />

            <TextField
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ width: 350, mb: 2 }}
                InputProps={{
                    endAdornment: password ? (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setPassword("")}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ) : null
                }}
            />

            <TextField
                type="password"
                label="Password Confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                sx={{ width: 350, mb: 3 }}
                InputProps={{
                    endAdornment: confirm ? (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setConfirm("")}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ) : null
                }}
            />

            <Typography 
                variant="body2"
                sx={{ color: "red", mt: 1, minHeight: "20px" }}
            >
                {errorText}
            </Typography>            

            <Box sx={{ display: "flex", gap: 2, mb: 5 }}>
                <Button
                    variant="contained"
                    sx={{
                        width: 150,
                        backgroundColor: "#333",
                        ":hover": { backgroundColor: "#555" },
                    }}
                    onClick={handleComplete}
                >
                    Complete
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        width: 150,
                        backgroundColor: "#333",
                        ":hover": { backgroundColor: "#555" },
                    }}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            </Box>

            <Copyright sx={{ mt: 5 }} />
        </Box>
    );
};

export default EditAccountScreen;
