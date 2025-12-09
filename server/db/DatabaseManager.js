const mongoose = require('mongoose')
const dotenv = require('dotenv')

const Playlist = require('../models/PlaylistModel.js')
const User = require('../models/UserModel.js')
const Song = require('../models/SongModel.js')

dotenv.config();

const {isDefined} = require('../util/Util');

class DatabaseManager {

    constructor() {
    }    

    async connect() {
        try {
            await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
            await this.defineModels();
            return mongoose.connection;
        } catch (err) {
            console.error('Connection error', err.message)
            return null;
        }   
    }

    async createPlaylist(name, ownerId, songs, listeners) {
        let playlist = new Playlist({name: name, owner: ownerId, songs: songs, uniqueListeners: listeners});
        try {
            return await playlist.save();
        } catch (err) {
            console.log("Could not create playlist: " + err);
            return null;
        }
    }

    async createUser(username, email, avatar, passwordHash, playlists) {
        let user = new User({username, email, avatar, passwordHash, playlists});
        try {
            return await user.save();
        } catch (err) {
            console.log("Could not create user: " + err);
            return null;
        } 
    }

    async createSong(title, artist, year, youTubeId, ownerId, playlists, listens) {
        let song = new Song({title, artist, year, youTubeId, owner: ownerId, playlists, listens});
        try {
            return await song.save();
        } catch (err) {
            console.log("Could not create song: " + err);
            return null;
        } 
    }

    async findPlaylist(options) {
        try {
            return await Playlist.findOne(options);
        } catch (err) {
            return null;
        }  
    }

    async findPlaylists(options) {
        try {
            return await Playlist.find(options);
        } catch (err) {
            return null;
        }
    }

    async findUser(options) {
        // let allUsers = await User.find({});
        // console.log("allUsers: " + allUsers);
        //console.log("options: " + JSON.stringify(options));
        try {
            let user = await User.findOne(options);
            //console.log("user: " + JSON.stringify(user));
            return user;
        } catch (err) {
            return null;
        } 
    }

    async findSong(options) {
        try {
            let song = await Song.findOne(options);
            console.log("song: " + JSON.stringify(song));
            return song;
        } catch (err) {
            return null;
        } 
    }

    async findSongs(options) {
        try {
            let songs = await Song.find(options);
            //console.log("songs: " + JSON.stringify(song));
            return songs;
        } catch (err) {
            return null;
        } 
    }

    async updatePlaylist(playlistId, newName, newSongs) {
        console.log("updatePlaylist new playlist: " + playlist);
        let updateOptions = {};
        if (isDefined(newName) || isDefined(newSongs)) {
            updateOptions.$set = {};
            if (isDefined(newName)) updateOptions.$set.name = newName;
            if (isDefined(newSongs)) updateOptions.$set.songs = newSongs;
        }
        try {
            return await Playlist.findOneAndUpdate({_id: playlistId}, updateOptions, {new: true});
        } catch (err) {
            console.log("Couldn't update playlsit: " + err)
            return null;
        }
    }

    async addSongToPlaylist(playlistId, newSong, index) {
        let updateOptions = {};
        if (isDefined(newSong)) {
            updateOptions.$push = {songs : {$each: [newSong], $position: index}};
        }
        try {
            return await Playlist.findOneAndUpdate({_id: playlistId}, updateOptions, {new: true});
        } catch (err) {
            console.log("Couldn't add new song to playlsit: " + err)
            return null;
        }
    }

    async removeSongFromPlaylist(playlistId, removeSong) {
        let updateOptions = {};
        if (isDefined(removeSong)) {
            updateOptions.$pull = {songs : removeSong};
        }
        try {
            return await Playlist.findOneAndUpdate({_id: playlistId}, updateOptions, {new: true});
        } catch (err) {
            console.log("Couldn't remove song from playlsit: " + err)
            return null;
        }
    }

    async addListenerToPlaylist(playlistId, newListener) {
        let updateOptions = {};
        if (isDefined(newListener)) {
            updateOptions.$addToSet = {uniqueListeners : newListener};
        }
        try {
            return await Playlist.findOneAndUpdate({_id: playlistId}, updateOptions, {new: true});
        } catch (err) {
            console.log("Couldn't add new listener to playlsit: " + err)
            return null;
        }
    }

    async removeListenerFromPlaylist(playlistId, removeListener) {
        let updateOptions = {};
        if (isDefined(removeListener)) {
            updateOptions.$pull = {uniqueListeners : removeListener};
        }
        try {
            return await Playlist.findOneAndUpdate({_id: playlistId}, updateOptions, {new: true});
        } catch (err) {
            console.log("Couldn't remove listener from playlsit: " + err)
            return null;
        }
    }

    async updateUser(userId, newUsername, newAvatar, newPasswordHash) {
        let updateOptions = {};
        if (isDefined(newUsername) || isDefined(newAvatar) || isDefined(newPasswordHash)) {
            updateOptions.$set = {};
            if (isDefined(newUsername)) updateOptions.$set.username = newUsername;
            if (isDefined(newAvatar)) updateOptions.$set.avatar = newAvatar;
            if (isDefined(newPasswordHash)) updateOptions.$set.passwordHash = newPasswordHash;
        }
        try {
            return await User.findOneAndUpdate({_id: userId}, updateOptions, {new: true});
        } catch (err) {
            return null;
        }
    }

    async addPlaylistToUser(userId, newPlaylist) {
        let updateOptions = {};
        if (isDefined(newPlaylist)) {
            updateOptions.$addToSet = {playlists: newPlaylist};
        }
        try {
            return await User.findOneAndUpdate({_id: userId}, updateOptions, {new: true});
        } catch (err) {
            return null;
        }
    }

    async removePlaylistFromUser(userId, removeList) {
        let updateOptions = {};
        if (isDefined(removeList)) {
            updateOptions.$pull = {playlists: removeList};
        }
        try {
            return await User.findOneAndUpdate({_id: userId}, updateOptions, {new: true});
        } catch (err) {
            return null;
        }
    }

    async updateSong(songId, newTitle, newArtist, newYear, newYouTubeId, newListenCount) {
        let updateOptions = {};
        if (isDefined(newTitle) || isDefined(newArtist) || isDefined(newYear) || isDefined(newYouTubeId) || isDefined(newListenCount)) {
            updateOptions.$set = {};
            if (isDefined(newTitle)) updateOptions.$set.title = newTitle;
            if (isDefined(newArtist)) updateOptions.$set.artist = newArtist;
            if (isDefined(newYear)) updateOptions.$set.year = newYear;
            if (isDefined(newYouTubeId)) updateOptions.$set.youTubeId = newYouTubeId;
            if (isDefined(newListenCount)) updateOptions.$set.listens = newListenCount
        }
        try {
            return await Song.findOneAndUpdate({_id: songId}, updateOptions, {new: true});
        } catch (err) {
            return null;
        }
    }

    async addPlaylistToSong(songId, newPlaylist) {
        let updateOptions = {};
        if (isDefined(newPlaylist)) {
            updateOptions.$addToSet = {playlists: newPlaylist};
        }
        try {
            return await Song.findOneAndUpdate({_id: songId}, updateOptions, {new: true});
        } catch (err) {
            return null;
        }
    }

    async removePlaylistFromSong(songId, removeList) {
        let updateOptions = {};
        if (isDefined(removeList)) {
            updateOptions.$pull = {playlists: removeList};
        }
        try {
            return await Song.findOneAndUpdate({_id: songId}, updateOptions, {new: true});
        } catch (err) {
            return null;
        }
    }

    async deletePlaylist(options) {
        let result = await Playlist.deleteOne(options);
        console.log("deletePlaylist result: " + JSON.stringify(result))
        return result.deletedCount > 0;
    }

    async deleteSong(options) {
        let result = await Song.deleteOne(options);
        console.log("deleteSong result: " + JSON.stringify(result))
        return result.deletedCount > 0;
    }
}

const DB = new DatabaseManager();

module.exports = { DatabaseManager, DB, Playlist, User, Song };