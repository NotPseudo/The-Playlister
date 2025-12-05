const auth = require('../auth')

const { DB, Playlist } = require('../db/DatabaseManager')

const {isDefined} = require('../util/util.js')

async function doesUserIdOwnPlaylistId(userId, playlistId) {
    let user = await DB.findUser({_id: userId});
    if (!user) return false;
    return user.playlists.some(id => id.equals(playlistId));
}

async function doesUserIdOwnSongId(userId, songId) {
    let song = await DB.findSong({_id: songId});
    if (!song) return false;
    return song.owner.equals(userId);
}

createPlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            success: false,
            error: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    let { name, ownerId, songs, listeners } = body;
    let playlist = await DB.createPlaylist(name, ownerId, songs, listeners)
    console.log("playlist: " + JSON.stringify(playlist));
    if (!playlist) {
        return res.status(400).json({ success: false, error: "Playlist not created" })
    }
    let returnPlaylist = await playlistInstanceToJSON(playlist);
    console.log("In createPlaylist after playlist.toJSON(): " + JSON.stringify(returnPlaylist));
    let user = await DB.findUser({_id: req.userId});
    console.log("user found: " + JSON.stringify(user));
    if (!user) {
        return res.status(400).json({ success: false, error: "Owner user for playlist not found" })
    }
    if (!await DB.addPlaylistToUser(user._id, playlist_.id)) {
        return res.status(500).json({ success: false, error: "Could not add the playlist to the user" })
    }
    return res.status(201).json({ success: true, playlist: returnPlaylist })
}

createSong = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            success: false,
            error: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("createSong body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Song',
        })
    }
    let { title, artist, year, youTubeId, ownerId, playlists, listens } = body;
    let song = await DB.createSong(title, artist, year, youTubeId, ownerId, playlists, listens);
    console.log("song: " + JSON.stringify(song));
    if (!song) {
        return res.status(400).json({ success: false, error: "Song not created" })
    }
    let returnSong = songInstanceToJSON(song);
    console.log("In createSong after song.toJSON(): " + JSON.stringify(returnSong));
    return res.status(201).json({ success: true, song: returnSong })
}

deletePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    let playlist = await DB.findPlaylist({_id: req.params.id});
    if (!playlist) return res.status(400).json({success: false, error: "Playlist not found"});
    if (!await doesUserIdOwnPlaylistId(req.userId, req.params.id)) return res.status(400).json({success: false, error: "User does not own the playlist"});
    for (let songId of playlist.songs) {
        if (!await DB.removePlaylistFromSong(songId, req.params.id)) return res.status(500).json({ success: false, error: "Unable to delete the playlist from song " + songId });
    }
    if (!await DB.removePlaylistFromUser(req.userId, req.params.id)) return res.status(500).json({ success: false, error: "Unable to remove playlist from user" });
    if (!await DB.deletePlaylist({_id: req.params.id})) return res.status(500).json({ success: false, error: "Unable to delete the playlist" });
    return res.status(200).json({success: true});
}

deleteSong = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    let song = await DB.findSong({_id: req.params.id});
    if (!song) return res.status(400).json({success: false, error: "Song not found"});
    if (!await doesUserIdOwnSongId(req.userId, req.params.id)) return res.status(400).json({success: false, error: "User does not own the song"});
    for (let listId of song.playlists) {
        if (!await DB.removeSongFromPlaylist(listId, song._id)) return res.status(500).json({ success: false, error: "Unable to delete the song from playlist " + listId });
    }
    if (!await DB.deleteSong({_id: song._id})) return res.status(500).json({ success: false, error: "Unable to delete the song" });
    return res.status(200).json({success: true});
}

songInstanceToJSON = (instance) => {
    let songJSON = instance.toJSON();
    songJSON.playlists = instance.playlists.length;
    return songJSON;
}

playlistInstanceToJSON = async (instance) => {
    let playlist = await instance.populate("songs");
    let songs = playlist.songs.map(s => songInstanceToJSON(s));
    let playlistJSON = playlist.toJSON();
    playlistJSON.songs = songs;
    playlistJSON.uniqueListeners = playlist.uniqueListeners.length;
    return playlistJSON;
}

getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));
    let playlist = await DB.findPlaylist({ _id: req.params.id });
    if (!playlist) return res.status(400).json({ success: false, errorMessage: 'Playlist not found!' });
    console.log("Found list: " + JSON.stringify(playlist));
    let returnPlaylist = await playlistInstanceToJSON(playlist);
    return res.status(200).json({ success: true, playlist: returnPlaylist })
}

getSongById = async (req, res) => {
    // if(auth.verifyUser(req) === null){
    //     return res.status(400).json({
    //         errorMessage: 'UNAUTHORIZED'
    //     })
    // }
    console.log("Song with id: " + JSON.stringify(req.params.id));

    let song = await DB.findSong({ _id: req.params.id });
    if (!song) return res.status(400).json({ success: false, error: 'Song not found!' });
    console.log("Found song: " + JSON.stringify(song));

    let returnSong = songInstanceToJSON(song);
    return res.status(200).json({ success: true, song: returnSong })
}

// getPlaylistPairs = async (req, res) => {
//     if(auth.verifyUser(req) === null){
//         return res.status(400).json({
//             errorMessage: 'UNAUTHORIZED'
//         })
//     }
//     console.log("getPlaylistPairs");

//     let user = await db.findUser({ id: req.userId });
//     if (!user) return res.status(400).json({ success: false, errorMessage: 'User not found!' });
//     let playlists = await db.findPlaylists({ ownerEmail: user.email });
//     if (!playlists) return res.status(400).json({ success: false, errorMessage: 'Playlists not found!' });
//     console.log("Send the Playlist pairs");
//     //console.log(playlists);
//     // PUT ALL THE LISTS INTO ID, NAME PAIRS
//     let pairs = [];
//     for (let key in playlists) {
//         let list = playlists[key];
//         let pair = {
//             _id: (isDefined(list._id) ? list._id : list.id),
//             name: list.name
//         };
//         pairs.push(pair);
//     }
//     return res.status(200).json({ success: true, idNamePairs: pairs })

//     // await User.findOne({ _id: req.userId }, (err, user) => {
//     //     console.log("find user with id " + req.userId);
//     //     async function asyncFindList(email) {
//     //         console.log("find all Playlists owned by " + email);
//     //         await Playlist.find({ ownerEmail: email }, (err, playlists) => {
//     //             console.log("found Playlists: " + JSON.stringify(playlists));
//     //             if (err) {
//     //                 return res.status(400).json({ success: false, error: err })
//     //             }
//     //             if (!playlists) {
//     //                 console.log("!playlists.length");
//     //                 return res
//     //                     .status(404)
//     //                     .json({ success: false, error: 'Playlists not found' })
//     //             }
//     //             else {
//     //                 console.log("Send the Playlist pairs");
//     //                 // PUT ALL THE LISTS INTO ID, NAME PAIRS
//     //                 let pairs = [];
//     //                 for (let key in playlists) {
//     //                     let list = playlists[key];
//     //                     let pair = {
//     //                         _id: list._id,
//     //                         name: list.name
//     //                     };
//     //                     pairs.push(pair);
//     //                 }
//     //                 return res.status(200).json({ success: true, idNamePairs: pairs })
//     //             }
//     //         }).catch(err => console.log(err))
//     //     }
//     //     asyncFindList(user.email);
//     // }).catch(err => console.log(err))
// }

// getPlaylists = async (req, res) => {
//     if(auth.verifyUser(req) === null){
//         return res.status(400).json({
//             errorMessage: 'UNAUTHORIZED'
//         })
//     }
//     let playlists = await db.findPlaylists({});
//     if (!playlists || !playlists.length) return res.status(404).json({ success: false, error: `Playlists not found` });
//     playlists = playlists.map(p => p.toJSON());
//     return res.status(200).json({ success: true, data: playlists })
//     // await Playlist.find({}, (err, playlists) => {
//     //     if (err) {
//     //         return res.status(400).json({ success: false, error: err })
//     //     }
//     //     if (!playlists.length) {
//     //         return res
//     //             .status(404)
//     //             .json({ success: false, error: `Playlists not found` })
//     //     }
//     //     return res.status(200).json({ success: true, data: playlists })
//     // }).catch(err => console.log(err))
// }

updatePlaylistChangeName = async (req, res) => {
    if (!isDefined(req.body.name)) return res.status(400).json({ success: false, error: "New list name not provided"});
    let updatedPlaylist = await DB.updatePlaylist(req.params.id, req.body.name, null)
    if (!updatedPlaylist) return res.status(500).json({ success: false, error: "Unable to change list name"});
    let returnPlaylist = await playlistInstanceToJSON(updatedPlaylist);
    return res.status(200).json({ success: true, playlist: returnPlaylist});
}

updatePlaylistCreateSong = async (req, res) => {
    let index = req.body.index;
    if (!isDefined(index)) return res.status(400).json({success: false, error: "Index not specified"});
    let songId = req.body.songId;
    if (!isDefined(songId)) return res.status(400).json({success: false, error: "songId not specified"});
    let playlist = await DB.findPlaylist({_id: req.params.id});
    if (!playlist) return res.status(400).json({success: false, error: "Unable to find list"});
    let song = await DB.findSong({_id: songId});
    if (!song) return res.status(400).json({success: false, error: "Unable to find song"});
    if (index > playlist.songs.length) return res.status(400).json({success: false, error: "Index invalid"});
    await DB.addPlaylistToSong(songId, req.params.id);
    let updatedPlaylist = await DB.addSongToPlaylist(req.params.id, songId, index);
    if (!updatedPlaylist) return res.status(500).json({ success: false, error: "Unable to create song in list"});
    let returnPlaylist = await playlistInstanceToJSON(updatedPlaylist);
    return res.status(200).json({ success: true, playlist: returnPlaylist});
}

updatePlaylistMoveSong = async (req, res) => {
    let from = req.body.fromIndex;
    let to = req.body.toIndex;
    if (!isDefined(from) || !isDefined(to)) return res.status(400).json({success: false, error: "Move indices not specified"});
    let playlist = await DB.findPlaylist({_id: req.params.id});
    if (!playlist) return res.status(400).json({success: false, error: "Unable to find list"});
    if (from >= playlist.songs.length || to >= playlist.songs.length) return res.status(400).json({success: false, message: "Move indices invalid"});
    let songsCopy = [...playlist.songs];
    let temp = songsCopy[from];
    songsCopy.splice(from, 1);
    songsCopy.splice(to, 0, temp);
    let updatedPlaylist = await DB.updatePlaylist(req.params.id, null, songsCopy);
    if (!updatedPlaylist) return res.status(500).json({ success: false, error: "Unable to move song in list"});
    let returnPlaylist = await playlistInstanceToJSON(updatedPlaylist);
    return res.status(200).json({ success: true, playlist: returnPlaylist});
}

updatePlaylistRemoveSong = async (req, res) => {
    let songId = req.body.songId;
    if (!isDefined(songId)) return res.status(400).json({success: false, error: "songId not specified"});
    let playlist = await DB.findPlaylist({_id: req.params.id});
    if (!playlist) return res.status(400).json({success: false, error: "Unable to find list"});
    if (!playlist.songs.some(sId => sId.equals(songId))) return res.status(400).json({success: false, error: "List does not contain song"});
    let song = await DB.findSong({_id: songId});
    if (!song) return res.status(400).json({success: false, error: "Unable to find song"});
    await DB.removePlaylistFromSong(songId, req.params.id);
    let updatedPlaylist = await DB.removeSongFromPlaylist(req.params.id, songId);
    if (!updatedPlaylist) return res.status(500).json({ success: false, error: "Unable to remove song from list"});
    let returnPlaylist = await playlistInstanceToJSON(updatedPlaylist);
    return res.status(200).json({ success: true, playlist: returnPlaylist});
}

updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.params: " + JSON.stringify(req.params));

    if (!await doesUserIdOwnPlaylistId(req.userId, req.params.id)) return res.status(400).json({success: false, error: "User does not own the playlist"});
    
    switch (req.body.updateType) {
        case "changeName":
            return await updatePlaylistChangeName(req, res);
            break;
        case "createSong":
            return await updatePlaylistCreateSong(req, res);
            break;
        case "moveSong":
            return await updatePlaylistMoveSong(req, res);
            break;
        case "removeSong":
            return await updatePlaylistRemoveSong(req, res);
            break;
        default:
            return res.status(400).json({ success: false, error: 'Invalid update type not found!' });
    }
}

updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.params: " + JSON.stringify(req.params));

    if (!await doesUserIdOwnPlaylistId(req.userId, req.params.id)) return res.status(400).json({success: false, error: "User does not own the playlist"});
    
    switch (req.body.updateType) {
        case "changeName":
            return await updatePlaylistChangeName(req, res);
            break;
        case "createSong":
            return await updatePlaylistCreateSong(req, res);
            break;
        case "moveSong":
            return await updatePlaylistMoveSong(req, res);
            break;
        case "removeSong":
            return await updatePlaylistRemoveSong(req, res);
            break;
        default:
            return res.status(400).json({ success: false, error: 'Invalid update type not found!' });
    }
}

updateSong = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    let { title, artist, year, youTubeId } = req.body;
    let updatedSong = await DB.updateSong(req.params.id, title, artist, year, youTubeId, null);
    if (!updatedSong) return res.status(500).json({ success: false, error: "Unable to update song"});
    let returnSong = songInstanceToJSON(updatedSong);
    return res.status(200).json({ success: true, song: returnSong});
}

listenToPlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    await DB.addListenerToPlaylist(req.userId, req.params.id);
    return res.status(200).json({ success: true });
}

listenToSong = async (req, res) => {
    let song = await DB.findSong({_id: req.params.id});
    let updatedSong = await DB.updateSong(req.params.id, null, null, null, null, song.listens + 1);
    if (!updatedSong) return res.status(500).json({ success: false, error: "Could not count new listen to song"});
    return res.status(200).json({ success: true});
}

searchForPlaylists = async (req, res) => {
    let { name, username, songTitle, songArtist, songYear } = req.query;
    let matchConditions = {};
    if (isDefined(name)) matchConditions.name = { $regex: name, $options: "i" };
    if (isDefined(username)) matchConditions["ownerData.username"] = { $regex: username, $options: "i" };
    if (isDefined(songTitle)) matchConditions["songsData.title"] = { $regex: songTitle, $options: "i" };
    if (isDefined(songArtist)) matchConditions["songsData.artist"] = { $regex: songArtist, $options: "i" };
    if (isDefined(songYear)) matchConditions["songsData.year"] = parseInt(songYear);
    try {
        const lists = await Playlist.aggregate([
            { $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerData"
                } },
            { $unwind: "$ownerData" },
            { $lookup: {
                    from: "songs",
                    localField: "songs",
                    foreignField: "_id",
                    as: "songsData"
                } },
            { $match: matchConditions }
        ]);
        listsJSON = [];
        for (let l of lists) {
            listsJSON.push(await playlistInstanceToJSON(l));
        }
        return res.status(200).json({ success: true, playlists: listsJSON });
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
};


searchForSongs = async (req, res) => {
    let { title, artist, year } = req.query;
    let conditions = {};
    if (isDefined(title)) conditions.title = { $regex: title, $options: "i" };
    if (isDefined(artist)) conditions.artist = { $regex: artist, $options: "i" };
    if (isDefined(year)) conditions.year = parseInt(year);
    let matches = await DB.findSongs(conditions);
    if (!matches) return res.status(500).json({ success: false, error: "Error searching for songs" });
    matches = matches.map(s => songInstanceToJSON(s));
    return res.status(200).json({ success: true, songs: matches });
};

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist
}