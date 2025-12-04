//const Playlist = require('../models/playlist-model')
//const User = require('../models/user-model');
const auth = require('../auth')

const  db  = require('../db/index')

function isDefined(object) {
    return object != null && object != undefined;
}

/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/

function getCommonJson(instance) {
    let json = instance.toJSON();
    console.log("instance.toJSON: " + JSON.stringify(json));
    json._id = json._id || json.id;
    return json;
}

createPlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
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
    let { name, ownerEmail, songs } = body;
    //const playlist = new Playlist(body);
    let playlist = await db.createPlaylist(name, ownerEmail, songs)
    console.log("playlist: " + JSON.stringify(playlist));
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }
    let returnPlaylist = getCommonJson(playlist);
    console.log("In createPlaylist after enforce: " + JSON.stringify(returnPlaylist));
    let user = await db.findUser({id: req.userId});
    console.log("user found: " + JSON.stringify(user));
    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }
    let newPlaylists = [...user.playlists, isDefined(playlist._id) ? playlist._id : playlist.id];
    if (!await db.updateUser(user, { playlists: newPlaylists })) {
        return res.status(500).json({ success: false, error: err })
    }
    return res.status(201).json({ playlist: returnPlaylist })
    // User.findOne({ _id: req.userId }, (err, user) => {
        
    //     user.playlists.push(playlist._id);
    //     user
    //         .save()
    //         .then(() => {
    //             playlist
    //                 .save()
    //                 .then(() => {
    //                     return res.status(201).json({
    //                         playlist: playlist
    //                     })
    //                 })
    //                 .catch(error => {
    //                     return res.status(400).json({
    //                         errorMessage: 'Playlist Not Created!'
    //                     })
    //                 })
    //         });
    // })
}

deletePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    let playlist = await db.findPlaylist({ id: req.params.id });
    console.log("playlist found: " + JSON.stringify(playlist));
    if (!playlist) return res.status(404).json({ errorMessage: 'Playlist not found!' });
    let user = await db.findUser({ email: playlist.ownerEmail });
    if (!user) return res.status(404).json({ errorMessage: 'Playlist owner not found!' });
    console.log("user._id: " + user._id);
    console.log("req.userId: " + req.userId);
    let userId = isDefined(user._id) ? user._id : user.id;
    console.log("userId: " + userId);
    console.log("req.userId: " + req.userId);
    if (userId != req.userId) {
        console.log("incorrect user!");
        return res.status(400).json({ errorMessage: "authentication error" });
    }
    console.log("correct user!");
    let newPlaylistIds = user.playlists.filter(e => e != req.params.id);
    if (!await db.updateUser(user, { playlists: newPlaylistIds })) return res.status(500).json({ errorMessage: "unable to remove user's playlist" });
    if (!await db.deletePlaylist({ id: req.params.id })) return res.status(500).json({ errorMessage: "unable to delete playlist" });
    return res.status(200).json({success: true});

    // Playlist.findById({ _id: req.params.id }, (err, playlist) => {
    //     console.log("playlist found: " + JSON.stringify(playlist));
    //     if (err) {
    //         return res.status(404).json({
    //             errorMessage: 'Playlist not found!',
    //         })
    //     }

    //     // DOES THIS LIST BELONG TO THIS USER?
    //     async function asyncFindUser(list) {
    //         User.findOne({ email: list.ownerEmail }, (err, user) => {
    //             console.log("user._id: " + user._id);
    //             console.log("req.userId: " + req.userId);
    //             if (user._id == req.userId) {
    //                 console.log("correct user!");
    //                 Playlist.findOneAndDelete({ _id: req.params.id }, () => {
    //                     return res.status(200).json({});
    //                 }).catch(err => console.log(err))
    //             }
    //             else {
    //                 console.log("incorrect user!");
    //                 return res.status(400).json({ 
    //                     errorMessage: "authentication error" 
    //                 });
    //             }
    //         });
    //     }
    //     asyncFindUser(playlist);
    // })
}

getPlaylistById = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    let playlist = await db.findPlaylist({ id: req.params.id });
    if (!playlist) return res.status(400).json({ success: false, errorMessage: 'Playlist not found!' });
    console.log("Found list: " + JSON.stringify(playlist));

    let returnPlaylist = getCommonJson(playlist);

    let user = await db.findUser({ email: playlist.ownerEmail });
    if (!user) return res.status(404).json({ errorMessage: 'Playlist owner not found!' });
    let userId = isDefined(user._id) ? user._id : user.id;
    console.log("userId: " + userId);
    console.log("req.userId: " + req.userId);
    if (userId != req.userId) {
        console.log("incorrect user!");
        return res.status(400).json({ errorMessage: "authentication error" });
    }
    console.log("correct user!");
    return res.status(200).json({ success: true, playlist: returnPlaylist })

    // await Playlist.findById({ _id: req.params.id }, (err, list) => {
    //     if (err) {
    //         return res.status(400).json({ success: false, error: err });
    //     }
    //     console.log("Found list: " + JSON.stringify(list));

    //     // DOES THIS LIST BELONG TO THIS USER?
    //     async function asyncFindUser(list) {
    //         await User.findOne({ email: list.ownerEmail }, (err, user) => {
    //             console.log("user._id: " + user._id);
    //             console.log("req.userId: " + req.userId);
    //             if (user._id == req.userId) {
    //                 console.log("correct user!");
    //                 return res.status(200).json({ success: true, playlist: list })
    //             }
    //             else {
    //                 console.log("incorrect user!");
    //                 return res.status(400).json({ success: false, description: "authentication error" });
    //             }
    //         });
    //     }
    //     asyncFindUser(list);
    // }).catch(err => console.log(err))
}

getPlaylistPairs = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("getPlaylistPairs");

    let user = await db.findUser({ id: req.userId });
    if (!user) return res.status(400).json({ success: false, errorMessage: 'User not found!' });
    let playlists = await db.findPlaylists({ ownerEmail: user.email });
    if (!playlists) return res.status(400).json({ success: false, errorMessage: 'Playlists not found!' });
    console.log("Send the Playlist pairs");
    //console.log(playlists);
    // PUT ALL THE LISTS INTO ID, NAME PAIRS
    let pairs = [];
    for (let key in playlists) {
        let list = playlists[key];
        let pair = {
            _id: (isDefined(list._id) ? list._id : list.id),
            name: list.name
        };
        pairs.push(pair);
    }
    return res.status(200).json({ success: true, idNamePairs: pairs })

    // await User.findOne({ _id: req.userId }, (err, user) => {
    //     console.log("find user with id " + req.userId);
    //     async function asyncFindList(email) {
    //         console.log("find all Playlists owned by " + email);
    //         await Playlist.find({ ownerEmail: email }, (err, playlists) => {
    //             console.log("found Playlists: " + JSON.stringify(playlists));
    //             if (err) {
    //                 return res.status(400).json({ success: false, error: err })
    //             }
    //             if (!playlists) {
    //                 console.log("!playlists.length");
    //                 return res
    //                     .status(404)
    //                     .json({ success: false, error: 'Playlists not found' })
    //             }
    //             else {
    //                 console.log("Send the Playlist pairs");
    //                 // PUT ALL THE LISTS INTO ID, NAME PAIRS
    //                 let pairs = [];
    //                 for (let key in playlists) {
    //                     let list = playlists[key];
    //                     let pair = {
    //                         _id: list._id,
    //                         name: list.name
    //                     };
    //                     pairs.push(pair);
    //                 }
    //                 return res.status(200).json({ success: true, idNamePairs: pairs })
    //             }
    //         }).catch(err => console.log(err))
    //     }
    //     asyncFindList(user.email);
    // }).catch(err => console.log(err))
}

getPlaylists = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    let playlists = await db.findPlaylists({});
    if (!playlists || !playlists.length) return res.status(404).json({ success: false, error: `Playlists not found` });
    playlists = playlists.map(p => getCommonJson(p));
    return res.status(200).json({ success: true, data: playlists })
    // await Playlist.find({}, (err, playlists) => {
    //     if (err) {
    //         return res.status(400).json({ success: false, error: err })
    //     }
    //     if (!playlists.length) {
    //         return res
    //             .status(404)
    //             .json({ success: false, error: `Playlists not found` })
    //     }
    //     return res.status(200).json({ success: true, data: playlists })
    // }).catch(err => console.log(err))
}

updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.params: " + JSON.stringify(req.params));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    let playlist = await db.findPlaylist({ id: req.params.id });
    if (!playlist) return res.status(404).json({ errorMessage: 'Playlist not found!' });
    let returnPlaylist = getCommonJson(playlist);
    console.log("playlist found: " + JSON.stringify(playlist));
    let user = await db.findUser({ email: playlist.ownerEmail });
    let userId = isDefined(user._id) ? user._id : user.id;
    console.log("userId: " + userId);
    console.log("req.userId: " + req.userId);
    if (userId != req.userId) {
        console.log("incorrect user!");
        return res.status(400).json({ success: false, errorMessage: "authentication error" });
    }
    if (!await db.updatePlaylist(playlist, body.playlist)) {
        console.log("FAILURE updating playlist");
        return res.status(404).json({ errorMessage: 'Playlist not updated!'})
    }
    console.log("SUCCESS!!!");
    return res.status(200).json({ success: true, id: returnPlaylist._id, message: 'Playlist updated!'})

    // Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
    //     console.log("playlist found: " + JSON.stringify(playlist));
    //     if (err) {
    //         return res.status(404).json({
    //             err,
    //             message: 'Playlist not found!',
    //         })
    //     }

    //     // DOES THIS LIST BELONG TO THIS USER?
    //     async function asyncFindUser(list) {
    //         await User.findOne({ email: list.ownerEmail }, (err, user) => {
    //             console.log("user._id: " + user._id);
    //             console.log("req.userId: " + req.userId);
    //             if (user._id == req.userId) {
    //                 console.log("correct user!");
    //                 console.log("req.body.name: " + req.body.name);

    //                 list.name = body.playlist.name;
    //                 list.songs = body.playlist.songs;
    //                 list
    //                     .save()
    //                     .then(() => {
    //                         console.log("SUCCESS!!!");
    //                         return res.status(200).json({
    //                             success: true,
    //                             id: list._id,
    //                             message: 'Playlist updated!',
    //                         })
    //                     })
    //                     .catch(error => {
    //                         console.log("FAILURE: " + JSON.stringify(error));
    //                         return res.status(404).json({
    //                             error,
    //                             message: 'Playlist not updated!',
    //                         })
    //                     })
    //             }
    //             else {
    //                 console.log("incorrect user!");
    //                 return res.status(400).json({ success: false, description: "authentication error" });
    //             }
    //         });
    //     }
    //     asyncFindUser(playlist);
    // })
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist
}