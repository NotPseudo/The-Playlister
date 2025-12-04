const dotenv = require('dotenv').config({ path: __dirname + '/../../../.env' });
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId


async function clearCollection(collection, collectionName) {
    try {
        await collection.deleteMany({});
        console.log(collectionName + " cleared");
    }
    catch (err) {
        console.log(err);
    }
}

async function fillCollection(collection, collectionName, data) {
    for (let i = 0; i < data.length; i++) {
        let doc = new collection(data[i]);
        await doc.save();
    }
    console.log(collectionName + " filled");
}

async function resetMongo() {
    const testData = require("./example-db-data.json")

    const PlaylistSchema = new Schema(
                {
                    name: { type: String, required: true },
                    ownerEmail: { type: String, required: true },
                    songs: { type: [{
                        title: String,
                        artist: String,
                        year: Number,
                        youTubeId: String
                    }], required: true }
                },
                { timestamps: true },
            )
            const UserSchema = new Schema(
                {
                    firstName: { type: String, required: true },
                    lastName: { type: String, required: true },
                    email: { type: String, required: true },
                    passwordHash: { type: String, required: true },
                    playlists: [{type: ObjectId, ref: 'Playlist'}]
                },
                { timestamps: true },
            )
            Playlist = mongoose.model('Playlist', PlaylistSchema);
            User = mongoose.model('User', UserSchema);

    console.log("Resetting the Mongo DB")
    await clearCollection(Playlist, "Playlist");
    await clearCollection(User, "User");
    await fillCollection(Playlist, "Playlist", testData.playlists);
    await fillCollection(User, "User", testData.users);
}

mongoose
    .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
    .then(() => { resetMongo() })
    .catch(e => {
        console.error('Connection error', e.message)
    })


