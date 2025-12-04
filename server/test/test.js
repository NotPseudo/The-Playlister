import { beforeAll, beforeEach, afterEach, afterAll, expect, test } from 'vitest';
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose')
const db = require('../db/index')

/**
 * Vitest test script for the Playlister app's Mongo Database Manager. Testing should verify that the Mongo Database Manager 
 * will perform all necessarily operations properly.
 *  
 * Scenarios we will test:
 *  1) Reading a User from the database
 *  2) Creating a User in the database
 *  3) ...
 * 
 * You should add at least one test for each database interaction. In the real world of course we would do many varied
 * tests for each interaction.
 */

/**
 * Executed once before all tests are performed.
 */
beforeAll(async () => {
    // SETUP THE CONNECTION VIA MONGOOSE JUST ONCE - IT IS IMPORTANT TO NOTE THAT INSTEAD
    // OF DOING THIS HERE, IT SHOULD BE DONE INSIDE YOUR Database Manager (WHICHEVER)
    // await mongoose
    //     .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
    //     .catch(e => {
    //         console.error('Connection error', e.message)
    //     })
    await db.connect();

});

/**
 * Executed before each test is performed.
 */
beforeEach(() => {
});

/**
 * Executed after each test is performed.
 */
afterEach(() => {
});

/**
 * Executed once after all tests are performed.
 */
afterAll(() => {
});

/**
 * Vitest test to see if the Database Manager can get a User.
 */
test('Test #1) Reading a User from the Database', async () => {
    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const expectedUser = {
        // FILL IN EXPECTED DATA
        firstName: "Joe",
        lastName: "Shmo",
        email: "joe@shmo.com"
    };

    // THIS WILL STORE THE DATA RETRUNED BY A READ USER
    let actualUser = {};

    // READ THE USER
    // actualUser = dbManager.somethingOrOtherToGetAUser(...)
    actualUser = await db.findUser({email: "joe@shmo.com"})

    // COMPARE THE VALUES OF THE EXPECTED USER TO THE ACTUAL ONE
    expect(expectedUser.firstName, actualUser.firstName)
    expect(expectedUser.lastName, actualUser.lastName);
    expect(expectedUser.email, actualUser.email);
    // AND SO ON
});

/**
 * Vitest test to see if the Database Manager can create a User
 */
test('Test #2) Creating a User in the Database', async () => {
    // MAKE A TEST USER TO CREATE IN THE DATABASE
    const testUser = {
        firstName: "first",
        lastName: "last",
        email: "test@test.com",
        passwordHash: "imaginethisworks"
    };

    // CREATE THE USER
    // dbManager.somethingOrOtherToCreateAUser(...)
    await db.createUser(testUser.firstName, testUser.lastName, testUser.email, testUser.passwordHash);

    // NEXT TEST TO SEE IF IT WAS PROPERLY CREATED

    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const expectedUser = {
        firstName: "first",
        lastName: "last",
        email: "test@test.com",
        passwordHash: "imaginethisworks"
    };

    // THIS WILL STORE THE DATA RETRUNED BY A READ USER
    let actualUser = await db.findUser({email: "test@test.com"})

    // COMPARE THE VALUES OF THE EXPECTED USER TO THE ACTUAL ONE
    expect(expectedUser.firstName, actualUser.firstName)
    expect(expectedUser.lastName, actualUser.lastName);
    expect(expectedUser.email, actualUser.email);
    expect(expectedUser.passwordHash, actualUser.passwordHash);
    // AND SO ON

});

// THE REST OF YOUR TEST SHOULD BE PUT BELOW

test('Test #3) Creating a Playlist in the Database', async () => {
    const name = "Test Create List";
    const ownerEmail = "test@test.com";
    const songs = [
                {
                    "title": "もしも命が描けたら",
                    "artist": "YOASOBI",
                    "year": 2021,
                    "youTubeId": "I0kytvnHG-Q"
                },
                {
                    "title": "Hong Kong",
                    "artist": "Yuno Miles",
                    "year": 2023,
                    "youTubeId": "HeCZZ131-HQ"
                },
                {
                    "title": "Lemon Drop",
                    "artist": "ATEEZ",
                    "year": 2025,
                    "youTubeId": "H4H99b1CjPU"
                }]

    await db.createPlaylist(name, ownerEmail, songs);

    let actualList = db.findPlaylist({name: "Test Create List"});

    expect(name, actualList.name)
    expect(ownerEmail, actualList.ownerEmail);
    expect(songs, actualList.songs)
    // AND SO ON

});

test('Test #4) Finding a Playlist in the Database', async () => {
    const name = "Test Create List";
    const ownerEmail = "test@test.com";
    const songs = [
                {
                    "title": "もしも命が描けたら",
                    "artist": "YOASOBI",
                    "year": 2021,
                    "youTubeId": "I0kytvnHG-Q"
                },
                {
                    "title": "Hong Kong",
                    "artist": "Yuno Miles",
                    "year": 2023,
                    "youTubeId": "HeCZZ131-HQ"
                },
                {
                    "title": "Lemon Drop",
                    "artist": "ATEEZ",
                    "year": 2025,
                    "youTubeId": "H4H99b1CjPU"
                }]

    let actualList = await db.findPlaylist({ownerEmail: "test@test.com"});

    expect(name, actualList.name)
    expect(ownerEmail, actualList.ownerEmail);
    expect(songs, actualList.songs)

});

test('Test #5) Finding Playlists Matching Conditions in the Database', async () => {
    const ownerEmail = "student@smith.com";
    const expectedLength = 3;
    const names = ["Old Songs", "Favorites", "Interesting"];

    const actualLists = await db.findPlaylist({ownerEmail: "student@smith.com"});

    expect(expectedLength, actualLists.length)
    for (let playlist in actualLists) {
        expect(ownerEmail, playlist.ownerEmail);
        expect(true, names.includes(playlist.name));
    }

});

test('Test #6) Updating a Playlist in the Database', async () => {
    const name = "Test Update List";
    const ownerEmail = "test@test.com";
    const songs = [
                {
                    "title": "もしも命が描けたら",
                    "artist": "YOASOBI",
                    "year": 2021,
                    "youTubeId": "I0kytvnHG-Q"
                },
                {
                    "title": "Hong Kong",
                    "artist": "Yuno Miles",
                    "year": 2023,
                    "youTubeId": "HeCZZ131-HQ"
                }];

    let playlistToUpdate = await db.findPlaylist({name: "Test Create List"});
    let id = playlistToUpdate.id || playlistToUpdate._id;

    await db.updatePlaylist(playlistToUpdate, {name: name, songs: songs});

    let actualList = await db.findPlaylist({id: id});

    expect(name, actualList.name)
    expect(ownerEmail, actualList.ownerEmail);
    expect(songs.length, actualList.songs.length);
    expect(songs, actualList.songs);

});

test('Test #7) Updating a User in the Database', async () => {
    const newFirstName = "NewFirst";
    const newLastName = "NewLast";
    const newEmail = "new@test.com";
    const newHash = "thisisnotreal"

    let userToUpdate = await db.findUser({email: "test@test.com"});
    let id = userToUpdate.id || userToUpdate._id;

    await db.updateUser(userToUpdate, {firstName: newFirstName, lastName: newLastName, email: newEmail, passwordHash: newHash});

    let actualUser = await db.findUser({id: id});

    expect(newFirstName, actualUser.firstName)
    expect(newLastName, actualUser.lastName);
    expect(newEmail, actualUser.email);
    expect(newHash, actualUser.passwordHash);

});

test('Test #8) Deleting a Playlist in the Database', async () => {
    let deleteResult = await db.deletePlaylist({name: "Test Update List"});

    let searchAttempt = await db.findPlaylist({name: "Test Update List"});

    expect(true, deleteResult)
    expect(null, searchAttempt);

});