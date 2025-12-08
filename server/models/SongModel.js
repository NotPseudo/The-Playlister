const mongoose = require("mongoose");
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

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
        
module.exports = mongoose.model('Song', SongSchema);