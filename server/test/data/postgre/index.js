const dotenv = require('dotenv').config({ path: __dirname + '/../../../.env' });
const { DataTypes, Sequelize } = require('sequelize')
const sequelize = new Sequelize(process.env.PG_DB_CONNECT)

async function clearTable(model, modelName) {
    try {
        await model.destroy({
            where: {},
            truncate: true
        });
        console.log(modelName + " cleared");
    } catch (err) {
        console.log(err);
    }
}

async function fillTable(model, modelName, data) {
    try {
        model.bulkCreate(data);
        console.log(modelName + " filled");
    } catch (err) {
        console.log(err);
    }
}

const Playlist = sequelize.define('Playlist', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ownerEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        songs: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: []
        }
    }, {
        tableName: 'playlists',
        timestamps: true
    });
    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        playlists: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        }
    }, {
        tableName: 'users',
        timestamps: true
    });

async function resetPostgres() {
    const testData = require("./example-db-data.json")

    console.log("Resetting the Postgres DB")
    await clearTable(Playlist, "Playlist");
    await clearTable(User, "User");
    await fillTable(Playlist, "Playlist", testData.playlists);
    await fillTable(User, "User", testData.users);
}

sequelize.authenticate()
    .then(() => {
        return sequelize.sync({ force: true })
    })
    .then(() => { 
        return resetPostgres()
    })
    .then(() => {
        sequelize.close()
    })
    .catch(e => {
        console.error('Connection error', e.message)
    })