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

// import axios from 'axios'
// axios.defaults.withCredentials = true;
const baseURL = 'http://localhost:4000/store';
// const api = axios.create({
//     baseURL: 'http://localhost:4000/store',
// })

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
// export const createPlaylist = (newListName, newSongs, userEmail) => {
//     return api.post(`/playlist/`, {
//         // SPECIFY THE PAYLOAD
//         name: newListName,
//         songs: newSongs,
//         ownerEmail: userEmail
//     })
// }
export const createPlaylist = async (newListName, newSongs, userEmail) => {
    let res = await fetch(baseURL + `/playlist`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: newListName,
            songs: newSongs,
            ownerEmail: userEmail
        })
    })
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}
//export const deletePlaylistById = (id) => api.delete(`/playlist/${id}`)
export const deletePlaylistById = async (id) => await fetchResToJSON(await fetch(baseURL + `/playlist/${id}`, {
    method: "DELETE",
    credentials: 'include'
}))
//export const getPlaylistById = (id) => api.get(`/playlist/${id}`)
export const getPlaylistById = async (id) => await fetchResToJSON(await fetch(baseURL + `/playlist/${id}`, {
    credentials: 'include'
}))
//export const getPlaylistPairs = () => api.get(`/playlistpairs/`)
export const getPlaylistPairs = async () => await fetchResToJSON(await fetch(baseURL + `/playlistpairs/`, {
    credentials: 'include'
}))
// export const updatePlaylistById = (id, playlist) => {
//     return api.put(`/playlist/${id}`, {
//         // SPECIFY THE PAYLOAD
//         playlist : playlist
//     })
// }
export const updatePlaylistById = async(id, playlist) => {
    let res = await fetch(baseURL + `/playlist/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            playlist : playlist
        })  
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById
}

export default apis
