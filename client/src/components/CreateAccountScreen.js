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

const CreateAccountScreen = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Form state
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        if (auth.error) setErrorText(auth.error);
    }, [auth.error]);

    // Avatar state
    const [avatar, setAvatar] = useState(null);

    const base64Encode = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);     // MUST be the File/Blob
            reader.onload = () => resolve(reader.result);
            reader.onerror = (e) => reject(e);
        });
    };

    const handleSelectAvatar = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const img = new Image();
        img.onload = async () => {
            if (img.width !== 250 || img.height !== 250) {
                event.target.value = "";
                setErrorText("Image resolution must be 250x250");
                return;
            }

            // Convert FILE to base64
            const base64 = await base64Encode(file);

            setAvatar(base64);
            setErrorText("");
        };
        img.src = URL.createObjectURL(file);
    };


    const handleCreateAccount = async () => {
        let res = await auth.registerUser(username, email, avatar, password, confirm);
        if (res) {
            navigate("/login")
        } else {
            // LET USER KNOW
        }
    };

    const goToLogin = () => {
        navigate("/login");
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
                Create Account
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
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: 350, mb: 2 }}
                InputProps={{
                    endAdornment: email ? (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setEmail("")}>
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

            <Button
                variant="contained"
                sx={{
                    width: 350,
                    py: 1,
                    mb: 2,
                    backgroundColor: "#333",
                    ":hover": { backgroundColor: "#555" }
                }}
                onClick={handleCreateAccount}
            >
                Create Account
            </Button>

            <Typography sx={{ mb: 5 }}>
                Already have an account?{" "}
                <Link
                    component="button"
                    underline="hover"
                    sx={{ color: "red", fontWeight: 600 }}
                    onClick={goToLogin}
                >
                    Sign In
                </Link>
            </Typography>

            <Copyright sx={{ mt: 5 }} />
        </Box>
    );
};

export default CreateAccountScreen;
