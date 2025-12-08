import React, { useState, useContext, useEffect } from "react";
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Link
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import AuthContext from '../auth/';
import { GlobalStoreContext } from '../store/';
import Copyright from "./Copyright";

const LoginScreen = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        if (auth.error) setErrorText(auth.error);
    }, [auth.error])

    const handleLogIn = async () => {
        const res = await auth.loginUser(email, password);
        if (res) {
            navigate("/playlists")
        } else {
            // LET USER KNOW
        }
    };

    const handleSignUpLink = () => {
        navigate("/register");
    };

    return (
        <Box
            sx={{
                mt: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <LockOutlinedIcon sx={{ fontSize: 60, mb: 2 }} />

            <Typography variant="h4" sx={{ mb: 4 }}>
                Sign In
            </Typography>

            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: 350, mb: 3 }}
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
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ width: 350, mb: 4 }}
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

            <Button
                variant="contained"
                color="primary"
                sx={{
                    width: 350,
                    py: 1,
                    mb: 2,
                    fontSize: "0.95rem",
                    backgroundColor: "#333",
                    ":hover": { backgroundColor: "#555" }
                }}
                onClick={handleLogIn}
            >
                SIGN IN
            </Button>

            <Typography 
                variant="body2"
                sx={{ color: "red", mt: 1, minHeight: "20px" }}
            >
                {errorText}
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
                Don’t have an account?{" "}
                <Link
                    component="button"
                    underline="hover"
                    sx={{ color: "red", fontWeight: 600 }}
                    onClick={handleSignUpLink}
                >
                    Sign Up
                </Link>
            </Typography>

            <Copyright sx={{ mt: 5 }} />
        </Box>
        
    );
};

export default LoginScreen;
