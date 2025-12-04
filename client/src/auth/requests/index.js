/*
    This is our http api for all things auth, which we use to 
    send authorization requests to our back-end API. Note we`re 
    using the Axios library for doing this, which is an easy to 
    use AJAX-based library. We could (and maybe should) use Fetch, 
    which is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
//axios.defaults.withCredentials = true;
const baseURL = 'http://localhost:4000/auth'
// const api = axios.create({
//     baseURL: ,
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
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

//export const getLoggedIn = () => api.get(`/loggedIn/`);
export const getLoggedIn = async () => await fetchResToJSON(await fetch(baseURL + `/loggedIn/`, {
    credentials: 'include'
}));
// export const loginUser = (email, password) => {
//     return api.post(`/login/`, {
//         email : email,
//         password : password
//     })
// }
export const loginUser = async (email, password) => { 
    let res = await fetch(baseURL + `/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: email, password: password})
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}
//export const logoutUser = () => api.get(`/logout/`)
export const logoutUser = async () => await fetchResToJSON(await fetch(baseURL + `/logout`, {
    credentials: 'include'
}));
// export const registerUser = (firstName, lastName, email, password, passwordVerify) => {
//     return api.post(`/register/`, {
//         firstName : firstName,
//         lastName : lastName,
//         email : email,
//         password : password,
//         passwordVerify : passwordVerify
//     })
// }
export const registerUser = async (firstName, lastName, email, password, passwordVerify) => {
    let res = await fetch(baseURL + `/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : password,
            passwordVerify : passwordVerify
        })
    });
    if (res.ok) {
        return await fetchResToJSON(res);
    }
    return { data: { success: false }, status: res.status }
}
const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
