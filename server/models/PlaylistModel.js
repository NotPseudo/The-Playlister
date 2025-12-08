const mongoose = require("mongoose");
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const PlaylistSchema = new Schema(
            {
                name: { type: String, required: true },
                owner: { type: ObjectId, ref: 'User', required: true },
                songs: [{type: ObjectId, ref: 'Song'}],
                uniqueListeners: [{ type: ObjectId, ref: 'User' }]
            },
            { timestamps: true },
        )

module.exports = mongoose.model("Playlist", PlaylistSchema)