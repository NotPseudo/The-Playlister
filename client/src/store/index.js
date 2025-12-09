import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {jsTPS} from "jstps"
import storeRequestSender from './requests'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    SEARCH_AND_LOAD_LISTS: "SEARCH_AND_LOAD_LISTS",
    SEARCH_AND_LOAD_OWNED: "SEARCH_AND_LOAD_OWNED",
    SORT_LISTS: "SORT_LISTS",

    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    DUPLICATE_LIST: "DUPLICATE_LIST",

    SET_EDIT_LIST: "SET_EDIT_LIST",
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    REMOVE_SONG_FROM_LIST: "REMOVE_SONG_FROM_LIST",
    RECREATE_SONG_IN_LIST: "RECREATE_SONG_IN_LIST",
    MOVE_SONG_IN_LIST: "MOVE_SONG_IN_LIST",
    CLOSE_EDIT_LIST: "CLOSE_EDIT_LIST",
    ADD_SONG_TO_LIST: "ADD_SONG_TO_LIST",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    DELETE_LIST: "DELETE_LIST",

    // --- SONGS --- 
    SEARCH_AND_LOAD_SONGS: "SEARCH_AND_LOAD_SONGS",
    SORT_SONGS: "SORT_SONGS",

    START_CREATE_NEW_SONG: "START_CREATE_NEW_SONG",
    COMPLETE_CREATE_NEW_SONG: "COMPLETE_CREATE_NEW_SONG",

    SET_EDIT_SONG: "SET_EDIT_SONG",
    COMPLETE_EDIT_SONG: "COMPLETE_EDIT_SONG",
    CLOSE_EDIT_SONG: "CLOSE_EDIT_SONG",

    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION",
    DELETE_SONG: "DELETE_SONG",

    SET_CATALOG_PLAYING_SONG: "SET_CATALOG_PLAYING_SONG",

    // --- MODALS ---

    SET_PLAYING_LIST: "SET_PLAYING_LIST",
    CLOSE_PLAYING_LIST: "CLOSE_PLAYING_LIST",

    HIDE_MODALS: "HIDE_MODALS",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    CREATE_SONG: "CREATE_SONG",
    DELETE_LIST : "DELETE_LIST",
    DELETE_SONG: "DELETE_SONG",
    EDIT_LIST: "EDIT_LIST",
    EDIT_SONG : "EDIT_SONG",
    PLAYER: "PLAYER",
    ERROR : "ERROR"
}

export const ListSortType = {
    LISTENERS_HILO: "LISTENERS_HILO",
    LISTENERS_LOHI: "LISTENERS_LOHI",
    NAME_AZ: "NAME_AZ",
    NAME_ZA: "NAME_ZA",
    USERNAME_AZ: "USERNAME_AZ",
    USERNAME_ZA: "USERNAME_ZA",
}

export const SongSortType = {
    LISTENS_HILO: "LISTENS_HILO",
    LISTENS_LOHI: "LISTENS_LOHI",
    NUMLISTS_HILO: "NUMLISTS_HILO",
    NUMLISTS_LOHI: "NUMLISTS_LOHI",
    TITLE_AZ: "TITLE_AZ",
    TITLE_ZA: "TITLE_ZA",
    ARTIST_AZ: "ARTIST_AZ",
    ARTIST_ZA: "ARTIST_ZA",
    YEAR_HILO: "YEAR_HILO",
    YEAR_LOHI: "YEAR_LOHI"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        playlistResults: [],
        listSortType: ListSortType.LISTENERS_HILO,
        recentEditLists: [],
        newListCounter: 0,

        editList: null,

        deleteList: null,

        songResults: [],
        songSortType: SongSortType.LISTENS_HILO,

        editSong: null,

        deleteSong: null,

        playingList: null,
        playingSongIndex: null,

        catalogPlayingSong: null,

        currentModal: null
    });
    const navigate = useNavigate();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.SEARCH_AND_LOAD_LISTS: {
                return setStore({
                    ...store,
                    playlistResults: payload.playlists
                });
            }
            case GlobalStoreActionType.SEARCH_AND_LOAD_OWNED: {
                return setStore({
                    ...store,
                    playlistResults: payload.playlists,
                    recentEditLists: payload.recentlyEdited 
                })
            }
            case GlobalStoreActionType.SORT_LISTS: {
                return setStore({
                    ...store,
                    playlistResults: payload.playlists,
                    listSortType: payload.sortType
                })
            }
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    ...store,
                    playlistResults: payload.playlists,
                    recentEditLists: payload.recentEditLists,
                    newListCounter: payload.newCounter
                })
            }
            case GlobalStoreActionType.DUPLICATE_LIST: {                
                return setStore({
                    ...store,
                    playlistResults: payload.playlists,
                    recentEditLists: payload.recentEditLists,
                })
            }
            case GlobalStoreActionType.SET_EDIT_LIST: {
                return setStore({
                    ...store,
                    editList: payload.list,
                    currentModal: CurrentModal.EDIT_LIST,
                });
            }
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    ...store,
                    editList: payload.list
                });
            }
            case GlobalStoreActionType.REMOVE_SONG_FROM_LIST: {
                return setStore({
                    ...store,
                    editList: payload.list
                });
            }
            case GlobalStoreActionType.RECREATE_SONG_IN_LIST: {
                return setStore({
                    ...store,
                    editList: payload.list
                });
            }
            case GlobalStoreActionType.MOVE_SONG_IN_LIST: {
                return setStore({
                    ...store,
                    editList: payload.list
                });
            }
            case GlobalStoreActionType.CLOSE_EDIT_LIST: {
                return setStore({
                    ...store,
                    editList: null,
                    currentModal: CurrentModal.NONE,
                    recentEditLists: payload.ownedLists
                });
            }
            case GlobalStoreActionType.ADD_SONG_TO_LIST: {
                return setStore({
                    ...store,
                    songResults: payload.songs
                });
            }
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    ...store,
                    deleteList: payload.list,
                    currentModal: CurrentModal.DELETE_LIST
                });
            }
            case GlobalStoreActionType.DELETE_LIST: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.NONE,
                    playlistResults: payload.playlists,
                    recentEditLists: payload.ownedLists
                })
            }
            case GlobalStoreActionType.SEARCH_AND_LOAD_SONGS: {
                return setStore({
                    ...store,
                    songResults: payload.songs
                });
            }
            case GlobalStoreActionType.SORT_SONGS: {
                return setStore({
                    ...store,
                    songResults: payload.songs,
                    songSortType: payload.sortType
                });
            }
            case GlobalStoreActionType.START_CREATE_NEW_SONG: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.CREATE_SONG
                });
            }
            case GlobalStoreActionType.COMPLETE_CREATE_NEW_SONG: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.NONE
                })
            }
            case GlobalStoreActionType.SET_EDIT_SONG: {
                return setStore({
                    ...store,
                    editSong: payload.song,
                    currentModal: CurrentModal.EDIT_SONG
                });
            }
            case GlobalStoreActionType.COMPLETE_EDIT_SONG: {
                return setStore({
                    ...store,
                    editSong: null,
                    currentModal: CurrentModal.NONE,
                    songResults: payload.songs
                });
            }
            case GlobalStoreActionType.CLOSE_EDIT_SONG: {
                return setStore({
                    ...store,
                    editSong: null,
                    currentModal: CurrentModal.NONE
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore({
                    ...store,
                    deleteSong: payload.song,
                    currentModal: CurrentModal.DELETE_SONG
                });
            }
            case GlobalStoreActionType.DELETE_SONG: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.NONE,
                    songResults: payload.songs,
                })
            }
            case GlobalStoreActionType.SET_CATALOG_PLAYING_SONG: {
                return setStore({
                    ...store,
                    catalogPlayingSong: payload.song
                });
            }
            case GlobalStoreActionType.SET_PLAYING_LIST: {
                return setStore({
                    ...store,
                    playingList: payload.playlist,
                    playingSongIndex: 0,

                    currentModal: CurrentModal.PLAYER
                });
            }
            case GlobalStoreActionType.CLOSE_PLAYING_LIST: {
                return setStore({
                    ...store,
                    playingList: null,
                    playingSongIndex: null,

                    currentModal: null
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.NONE
                });
            }

            default:
                return store;
        }
    }

    // CONTINUE BELOW

    store.searchAndLoadLists = (name, ownerName, songTitle, songArtist, songYear) => {
        async function asyncSearchLists(name, username, title, artist, year) {
            const response = await storeRequestSender.searchForPlaylists(name, username, title, artist, year);
            if (response.data.success) {
                let sorted = store.sortListResults(store.listSortType, response.data.playlists);
                storeReducer({
                    type: GlobalStoreActionType.SEARCH_AND_LOAD_LISTS,
                    payload: {playlists: sorted}
                })
            }
        }
        asyncSearchLists(name, ownerName, songTitle, songArtist, songYear);
    }

    store.findAndLoadOwnedLists = () => {
        if (!auth.loggedIn) {
            storeReducer({
                type: GlobalStoreActionType.SEARCH_AND_LOAD_OWNED,
                payload: {playlists: [], recentlyEdited: []}
            })
            return;
        }
        async function asyncFindOwned() {
            const response = await storeRequestSender.searchOwnedPlaylists();
            if (response.data.success) {
                let recentEdit = response.data.playlists.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                let sorted = store.sortListResults(store.listSortType, response.data.playlists);
                storeReducer({
                    type: GlobalStoreActionType.SEARCH_AND_LOAD_OWNED,
                    payload: {playlists: sorted, recentlyEdited: recentEdit}
                })
            }
        }
        asyncFindOwned();
    }

    store.clearSongs = () => {
        storeReducer({
            type: GlobalStoreActionType.SEARCH_AND_LOAD_SONGS,
            payload: {songs: []}
        })
    }

    store.setListSortOrder = (sortType) => {
        let newSort = store.sortListResults(sortType, store.playlistResults);
        storeReducer({
            type: GlobalStoreActionType.SORT_LISTS,
            payload: {playlists: newSort, sortType: sortType}
        })
    }

    store.sortListResults = (sortType, playlists) => {
        let toSort = [...playlists]
        switch (sortType) {
            case ListSortType.LISTENERS_HILO: {
                return toSort.sort((a, b) => b.uniqueListeners - a.uniqueListeners);
            }
            case ListSortType.LISTENERS_LOHI: {
                return toSort.sort((a, b) => a.uniqueListeners - b.uniqueListeners);
            }
            case ListSortType.NAME_AZ: {
                return toSort.sort((a, b) => a.name.localeCompare(b.name));
            }
            case ListSortType.NAME_ZA: {
                return toSort.sort((a, b) => b.name.localeCompare(a.name));
            }
            case ListSortType.USERNAME_AZ: {
                return toSort.sort((a, b) => a.owner.username.localeCompare(b.owner.username));
            }
            case ListSortType.USERNAME_ZA: {
                return toSort.sort((a, b) => b.owner.username.localeCompare(a.owner.username));
            }   
        }
        return toSort;
    }

    store.createNewList = () => {
        if (!auth.loggedIn) return;
        async function asyncCreateList() {
            let origCount = store.newListCounter;
            let name = "Untitled" + origCount;
            while (store.recentEditLists.some(l => l.name === name)) {
                origCount++;
                name = "Untitled" + origCount
            }
            console.log("createNewList auth: " + JSON.stringify(auth));
            const response = await storeRequestSender.createPlaylist(name, [], auth.user._id);
            if (response.data.success) {
                const sortResponse = await storeRequestSender.searchOwnedPlaylists();
                if (sortResponse.data.success) {
                    let sorted = sortResponse.data.playlists.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    let newResults = [...store.playlistResults, response.data.playlist];
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: {playlists: newResults, recentEditLists: sorted, newCounter: origCount + 1}
                    })
                }
            }
        }
        asyncCreateList();
    }

    store.duplicateList = (playlist) => {
        if (!auth.loggedIn) return;
        async function asyncDupeList(list) {
            let songIds = list.songs.map(s => s._id);
            const response = await storeRequestSender.createPlaylist(list.name + " (Copy)", songIds, auth.user._id);
            if (response.data.success) {
                const sortResponse = await storeRequestSender.searchOwnedPlaylists();
                if (sortResponse.data.success) {
                    let sorted = sortResponse.data.playlists.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    let newResults = [...store.playlistResults, response.data.playlist];
                    storeReducer({
                        type: GlobalStoreActionType.DUPLICATE_LIST,
                        payload: {playlists: newResults, recentEditLists: sorted}
                    })
                }
            }
        }
        asyncDupeList(playlist);
    }

    store.setEditList = (playlist) => {
        storeReducer({
            type: GlobalStoreActionType.SET_EDIT_LIST,
            payload: {list: playlist}
        })
    }

    store.addDuplicateTransaction = (song, dupeIndex) => {
        if (!auth.loggedIn) {
            store.hideModals();
            return;
        }
        async function asyncDuplicate(song, dupeIndex) {
            const response = await storeRequestSender.createSong(song.title, song.artist, song.year, song.youTubeId, auth.user._id);
            if (response.data.success) {
                let transaction = new CreateSong_Transaction(store, dupeIndex, response.data.song);
                tps.processTransaction(transaction);
            }
        }
        asyncDuplicate(song, dupeIndex)
    }

    store.addMoveSongTransaction = (from, to) => {
        let transaction = new MoveSong_Transaction(store, from, to);
        tps.processTransaction(transaction);
    }

    store.moveSong = (from, to) => {
        async function asyncMoveSong(from, to) {
            const response = await storeRequestSender.moveSongInPlaylist(store.editList._id, from, to);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.MOVE_SONG_IN_LIST,
                    payload: {list: response.data.playlist}
                });
            }
        }
        asyncMoveSong(from, to);
    }

    store.addRemoveSongFromListTransaction = (song, index) => {
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.processTransaction(transaction);
    }

    store.removeSongFromList = (songId) => {
        async function asyncRemoveSongFromList(songId) {
            const response = await storeRequestSender.removeSongFromPlaylist(store.editList._id, songId);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.REMOVE_SONG_FROM_LIST,
                    payload: {list: response.data.playlist}
                });
            }
        }
        asyncRemoveSongFromList(songId);
    }

    store.recreateSongInList = (songId, index) => {
        async function asyncRecreateSongInList(songId, index) {
            const response = await storeRequestSender.createSongInPlaylist(store.editList._id, songId, index);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.RECREATE_SONG_IN_LIST,
                    payload: {list: response.data.playlist}
                });
            }
        }
        asyncRecreateSongInList(songId, index);
    }

    store.editListChangeName = (name) => {
        async function asyncListChangeName(newName) {
            const response = await storeRequestSender.updatePlaylistName(store.editList._id, newName);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                    payload: {list: response.data.playlist}
                });
            }
        }
        asyncListChangeName(name);
    }

    store.closeEditList = () => {
        tps.clearAllTransactions();
        async function getRecentEdit() {
            const response = await storeRequestSender.searchOwnedPlaylists();
            if (response.data.success) {
                let sorted = response.data.playlists.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                storeReducer({
                    type: GlobalStoreActionType.CLOSE_EDIT_LIST,
                    payload: {ownedLists: sorted}
                })
            }
        }
        getRecentEdit();
    }

    store.addSongToPlaylist = (playlist, songId, index) => {
        async function asyncAddSongToList(playlistId, songId, index) {
            const response = await storeRequestSender.createSongInPlaylist(playlistId, songId, index);
            if (response.data.success) {
                const songResponse = await storeRequestSender.getSongById(songId);
                let updatedSong = store.songResults.find(s => s._id === songId);
                if (songResponse.data.success) updatedSong = songResponse.data.song;
                let newSongResults = [...store.songResults];
                newSongResults = newSongResults.map(s => s._id === songId ? updatedSong : s);
                storeReducer({
                    type: GlobalStoreActionType.ADD_SONG_TO_LIST,
                    payload: {songs: newSongResults}
                })
            }
        }
        asyncAddSongToList(playlist._id, songId, index);
    }

    store.markListForDeletion = (playlist) => {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: {list: playlist}
        })
    }

    store.deleteMarkedList = () => {
        async function asyncDeleteList(playlist) {
            let id = playlist._id;
            const response = await storeRequestSender.deletePlaylistById(id);
            if (response.data.success) {
                let newPlaylistResults = store.playlistResults.filter(p => p._id !== id);
                let newOwnedLists = store.recentEditLists.filter(p => p._id !== id);
                storeReducer({
                    type: GlobalStoreActionType.DELETE_LIST,
                    payload: {playlists: newPlaylistResults, ownedLists: newOwnedLists}
                })
            }
        }
        asyncDeleteList(store.deleteList);
    }

    store.searchAndLoadSongs = (title, artist, year) => {
        async function asyncSearchSongs(sTitle, sArtist, sYear) {
            const response = await storeRequestSender.searchForSongs(sTitle, sArtist, sYear);
            if (response.data.success) {
                let sorted = store.sortSongResults(store.songSortType, response.data.songs);
                storeReducer({
                    type: GlobalStoreActionType.SEARCH_AND_LOAD_SONGS,
                    payload: {songs: sorted}
                })
            }
        }
        asyncSearchSongs(title, artist, year);
    }

    store.setSongSortOrder = (sortType) => {
        let newSort = store.sortSongResults(sortType, store.songResults);
        storeReducer({
            type: GlobalStoreActionType.SORT_SONGS,
            payload: {songs: newSort, sortType: sortType}
        })
    }

    store.sortSongResults = (sortType, songs) => {
        let toSort = [...songs]
        switch (sortType) {
            case SongSortType.LISTENS_HILO: {
                return toSort.sort((a, b) => b.listens - a.listens);
            }
            case SongSortType.LISTENS_LOHI: {
                return toSort.sort((a, b) => a.listens - b.listens);
            }
            case SongSortType.NUMLISTS_HILO: {
                return toSort.sort((a, b) => b.playlists - a.playlists);
            }
            case SongSortType.NUMLISTS_LOHI: {
                return toSort.sort((a, b) => a.playlists - b.playlists);
            }
            case SongSortType.TITLE_AZ: {
                return toSort.sort((a, b) => a.title.localeCompare(b.title));
            }
            case SongSortType.TITLE_ZA: {
                return toSort.sort((a, b) => b.title.localeCompare(a.title));
            }
            case SongSortType.ARTIST_AZ: {
                return toSort.sort((a, b) => a.artist.localeCompare(b.artist));
            }
            case SongSortType.ARTIST_ZA: {
                return toSort.sort((a, b) => b.artist.localeCompare(a.artist));
            }
            case SongSortType.YEAR_HILO: {
                return toSort.sort((a, b) => b.year - a.year);
            }
            case SongSortType.YEAR_LOHI: {
                return toSort.sort((a, b) => a.year - b.year);
            }
        }
        return toSort;
    }

    store.createNewSong = () => {
        storeReducer({
            type: GlobalStoreActionType.START_CREATE_NEW_SONG,
            payload: {}
        })
    }

    store.sendCreateNewSong = (title, artist, year, youTubeId) => {
        if (!auth.loggedIn) {
            store.hideModals();
            return;
        }
        async function asyncSendCreateSong(newTitle, newArtist, newYear, newYouTubeId) {
            const response = await storeRequestSender.createSong(newTitle, newArtist, newYear, newYouTubeId, auth.user._id);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.COMPLETE_CREATE_NEW_SONG,
                    payload: {}
                })
            }
        }
        asyncSendCreateSong(title, artist, year, youTubeId);
    }

    store.setEditSong = (song) => {
        console.log("setEditSong: " + JSON.stringify(song))
        storeReducer({
            type: GlobalStoreActionType.SET_EDIT_SONG,
            payload: {song: song}
        })
    }

    store.performEditSong = (songId, title, artist, year, youTubeId) => {
        async function asyncEditSong(songId, title, artist, year, youTubeId) {
            const response = await storeRequestSender.updateSongById(songId, title, artist, year, youTubeId);
            let updatedSong = store.songResults.find(s => s._id === songId);
            if (response.data.success) {
                updatedSong = response.data.song;
                let newSongResults = [...store.songResults];
                newSongResults = newSongResults.map(s => s._id === songId ? updatedSong : s);
                storeReducer({
                    type: GlobalStoreActionType.COMPLETE_EDIT_SONG,
                    payload: {songs: newSongResults}
                })
            }
        }
        asyncEditSong(songId, title, artist, year, youTubeId);
    }  
    
    store.closeEditSong = () => {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_EDIT_SONG,
            payload: {}
        })
    }

    store.markSongForDeletion = (song) => {
        console.log("markSongForDeletion song: " + song)
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
            payload: {song: song}
        })
    }

    store.deleteMarkedSong = () => {
        async function asyncDeleteSong(songId) {
            const response = await storeRequestSender.deleteSongById(songId);
            if (response.data.success) {
                let newSongs = store.songResults.filter(s => s._id !== songId);
                storeReducer({
                    type: GlobalStoreActionType.DELETE_SONG,
                    payload: {songs: newSongs}
                })
            }
        }
        console.log("deleteMarkedSong _id: " + store.deleteSong._id);
        asyncDeleteSong(store.deleteSong._id);
    }

    store.setCatalogPlayingSong = (song) => {
        storeReducer({
            type: GlobalStoreActionType.SET_CATALOG_PLAYING_SONG,
            payload: {song: song}
        })
    }

    store.openListInPlayer = (playlist) => {
        storeReducer({
            type: GlobalStoreActionType.SET_PLAYING_LIST,
            payload: {list: playlist}
        })
    }

    store.hideModals = () => {
        auth.error = null;
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }

    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isDeleteSongModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_SONG;
    }
    store.isEditListModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isPlayerModalOpen = () => {
        return store.currentModal === CurrentModal.PLAYER;
    }
    store.isModalOpen = () => {
        return store.currentModal === CurrentModal.NONE;
    }

    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToDo());
    }

    function KeyPress(event) {
        if (store.isEditListModalOpen() && event.ctrlKey){
            if(event.key === 'z'){
                store.undo();
            } 
            if(event.key === 'y'){
                store.redo();
            }
        }
    }
  
    document.onkeydown = (event) => KeyPress(event);

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };