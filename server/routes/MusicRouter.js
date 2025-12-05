/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const MusicController = require('../controllers/MusicController')
const router = express.Router()
const auth = require('../auth/Auth')

router.post('/playlist', auth.verify, MusicController.createPlaylist)
router.post('/song', auth.verify, MusicController.createSong)

router.delete('/playlist/:id', auth.verify, MusicController.deletePlaylist)
router.delete('/song/:id', auth.verify, MusicController.deleteSong)

router.get('/playlist/:id', auth.verify, MusicController.getPlaylistById)
router.get('/song/:id', auth.verify, MusicController.getSongById)

router.patch('/playlist/:id', auth.verify, MusicController.updatePlaylist)
router.patch('/song/:id', auth.verify, MusicController.updateSong)

router.patch('/playlist/:id/listen', auth.verify, MusicController.listenToPlaylist)
router.patch('/song/:id/listen', auth.verify, MusicController.listenToSong)

router.get('/playlists', auth.verify, MusicController.searchForPlaylists)
router.put('/playlist/:id', auth.verify, MusicController.searchForSongs)

module.exports = router