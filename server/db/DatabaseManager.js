const DatabaseManager = require('../DatabaseManager');

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
dotenv.config();

let Playlist;
let User;
let Song;

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

    async defineModels() {
        const PlaylistSchema = new Schema(
            {
                name: { type: String, required: true },
                owner: { type: ObjectId, ref: 'User', required: true },
                songs: [{type: ObjectId, ref: 'Song'}],
                uniqueListeners: [{ type: ObjectId, ref: 'User' }]
            },
            { timestamps: true },
        )
        const UserSchema = new Schema(
            {
                username: { type: String, required: true },
                email: { type: String, required: true, unique: true },
                avatar: { type: String, required: true },
                passwordHash: { type: String, required: true },
                playlists: [{type: ObjectId, ref: 'Playlist'}]
            },
            { timestamps: true },
        )
        const SongSchema = new Schema(
            {
                title: { type: String, required: true },
                artist: { type: String, required: true },
                year: { type: Number, required: true },
                youTubeId: { type: String, required: true },
                owner: { type: ObjectId, ref: 'User', required: true },
                playlists: [{type: ObjectId, ref: 'Playlist'}],
                listens: { type: Number, default: 0}
            },
            { timestamps: true },
        )
        Playlist = mongoose.model('Playlist', PlaylistSchema);
        User = mongoose.model('User', UserSchema);
        Song = mongoose.model('Song', SongSchema);
        console.log("Models defined");
    }

    async createPlaylist(name, ownerId, songs, listeners) {
        let playlist = new Playlist({name, owner: ownerId, songs, uniqueListeners: listeners});
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
            console.log("user: " + JSON.stringify(user));
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

    async updatePlaylist(playlist, newData) {
        //playlist.name = newPlaylist.name;
        //playlist.songs = newPlaylist.songs;
        // for (let key in newData) {
        //     playlist[key] = newData[key];
        // }
        console.log("updatePlaylist new playlist: " + playlist);
        try {
            await Playlist.updateOne({_id: playlist._id}, {$set : newData});
            return true;
        } catch (err) {
            console.log("Couldn't update playlsit: " + err)
            return false;
        }
    }

    async updateUser(user, newData) {
        // for (let key in newData) {
        //     user[key] = newData[key];
        // }
        try {
            await User.updateOne({_id: user._id}, {$set: newData});
            return true;
        } catch (err) {
            return false;
        }
    }

    async updateSong(song, newData) {
        try {
            await Song.updateOne({_id: song._id}, {$set: newData});
            return true;
        } catch (err) {
            return false;
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

module.exports = DatabaseManager;