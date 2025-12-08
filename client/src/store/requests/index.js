/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/


const baseURL = 'http://localhost:4000/store';

const fetchResToJSON = async (res) => {
    let data = null;
    data = await res.json();
    return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        url: res.url,
        redirected: res.redirected,
        type: res.type,
        data: data
    }
}

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

export const createPlaylist = async (newListName, newSongs, userId) => {
    let res = await fetch(baseURL + `/playlist`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: newListName,
            songs: newSongs,
            ownerId: userId,
            listeners: []
        })
    })
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

export const createSong = async (title, artist, year, youTubeId, ownerId) => {
    let res = await fetch(baseURL + `/song`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title :title, 
            artist: artist,
            year: year,
            youTubeId: youTubeId,
            ownerId: ownerId,
            playlists: [],
            listens: 0
        })
    })
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

export const deletePlaylistById = async (id) => await fetchResToJSON(await fetch(baseURL + `/playlist/${id}`, {
    method: "DELETE",
    credentials: 'include'
}))

export const deleteSongById = async (id) => await fetchResToJSON(await fetch(baseURL + `/song/${id}`, {
    method: "DELETE",
    credentials: 'include'
}))

export const getPlaylistById = async (id) => await fetchResToJSON(await fetch(baseURL + `/playlist/${id}`, {
    credentials: 'include'
}))

export const getSongById = async (id) => await fetchResToJSON(await fetch(baseURL + `/song/${id}`, {
    credentials: 'include'
}))

export const updatePlaylistName = async(playlistId, newName) => {
    let res = await fetch(baseURL + `/playlist/${playlistId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            updateType: "CHANGE_NAME",
            name: newName
        })  
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

export const createSongInPlaylist = async(playlistId, songId, index) => {
    let res = await fetch(baseURL + `/playlist/${playlistId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            updateType: "CREATE_SONG",
            songId : songId,
            index: index
        })  
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

export const moveSongInPlaylist = async(playlistId, from, to) => {
    let res = await fetch(baseURL + `/playlist/${playlistId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            updateType: "MOVE_SONG",
            fromIndex : from,
            toIndex: to
        })  
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

export const removeSongFromPlaylist = async(playlistId, songId) => {
    let res = await fetch(baseURL + `/playlist/${playlistId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            updateType: "CHANGE_NAME",
            songId : songId
        })  
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

export const updateSongById = async(id, newTitle, newArtist, newYear, newYouTubeId) => {
    let res = await fetch(baseURL + `/song/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title : newTitle,
            artist: newArtist,
            year: newYear,
            youTubeId: newYouTubeId
        })  
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

export const listenToPlaylist = async(playlistId) => {
    let res = await fetch(baseURL + `/playlist/${playlistId}/listen`, {
        method: 'PATCH',
        credentials: 'include'
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

export const listenToSong = async(songId) => {
    let res = await fetch(baseURL + `/song/${songId}/listen`, {
        method: 'PATCH',
        credentials: 'include'
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

export const searchForPlaylists = async(listName, ownerName, searchTitle, searchArtist, searchYear) => {
    const params = new URLSearchParams();
    params.append("name", listName);
    params.append("username", ownerName);
    params.append("songTitle", searchTitle);
    params.append("songArtist", searchArtist);
    params.append("songYear", searchYear);

    let res = await fetch(baseURL + `/playlist?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

export const searchOwnedPlaylists = async() => {
    let res = await fetch(baseURL + `/playlist`, {
        method: 'GET',
        credentials: 'include'
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

export const searchForSongs = async(songTitle, songArtist, songYear) => {
    const params = new URLSearchParams();
    params.append("title", songTitle);
    params.append("artist", songArtist);
    params.append("year", songYear);

    let res = await fetch(baseURL + `/song?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

const apis = {
    createPlaylist,
    createSong,
    deletePlaylistById,
    deleteSongById,
    getPlaylistById,
    getSongById,
    updatePlaylistName,
    createSongInPlaylist,
    moveSongInPlaylist,
    removeSongFromPlaylist,
    updateSongById,
    listenToPlaylist,
    listenToSong,
    searchForPlaylists,
    searchOwnedPlaylists,
    searchForSongs
}

export default apis
