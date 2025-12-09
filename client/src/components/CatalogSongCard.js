import { useState, useContext } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";

export default function CatalogSongCard({ song }) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [anchorEl, setAnchorEl] = useState(null);          
    const [playlistAnchor, setPlaylistAnchor] = useState(null); 

    const handleCardClick = () => {
        store.setCatalogPlayingSong(song);
    }

    const handleExpandMain = (event) => { 
        event.stopPropagation();
        setAnchorEl(event.currentTarget); 
    };
    const handleClose = () => {
        setAnchorEl(null);
        setPlaylistAnchor(null);
    };

    const handleAddToListClick = (event) => {
        setPlaylistAnchor(event.currentTarget);
    };


    const handleEdit = (event) => {
        event.stopPropagation();
        store.setEditSong(song);
        handleClose();
    };


    const handleRemoveFromCatalog = (event) => {
        event.stopPropagation();
        store.markSongForDeletion(song);
        handleClose();
    };


    const handleClickOnPlaylist = (playlist) => {
        store.addSongToPlaylist(playlist._id, song._id, playlist.songs.length);
        handleClose();
    };
    
    const isOwner = auth.loggedIn && auth.user._id === song.owner._id;

    return (
        <Card
            sx={{
                borderRadius: "12px",
                mb: 2,
                p: 1,
                bgcolor: song.index % 2 === 0 ? "#FFEAA7" : "#FFF9C4",
                border: "2px solid #E57373",
            }}
            onClick={handleCardClick}
        >
            <CardContent sx={{ display: "flex", flexDirection: "column", p: 1 }}>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {song.title} by {song.artist} ({song.year})
                    </Typography>

                    {auth.loggedIn && <IconButton onClick={handleExpandMain}>
                        <MoreVertIcon />
                    </IconButton>}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Typography variant="subtitle1">
                        <strong>Listens:</strong> {song.listens}
                    </Typography>
                    <Typography variant="subtitle1">
                        <strong>Playlists:</strong> {song.playlists}
                    </Typography>
                </Box>
            </CardContent>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >

                {auth.loggedIn && (
                    <MenuItem onClick={handleAddToListClick}>
                        Add to Playlist
                    </MenuItem>
                )}

                {isOwner && (
                    <MenuItem onClick={handleEdit}>
                        Edit Song
                    </MenuItem>
                )}

                {isOwner && (
                    <MenuItem onClick={handleRemoveFromCatalog}>
                        Remove from Catalog
                    </MenuItem>
                )}

            </Menu>


            <Menu
                anchorEl={playlistAnchor}
                open={Boolean(playlistAnchor)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 300,
                        width: "260px",
                    },
                }}
            >
                {store.recentEditLists?.map((p) => (
                    <MenuItem key={p._id} onClick={() => handleClickOnPlaylist(p)}>
                        {p.name}
                    </MenuItem>
                ))}
            </Menu>

        </Card>
    );
}
