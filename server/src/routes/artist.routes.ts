import express from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
import {
    createArtist,
    createAlbum,
    createSong,
    deleteAlbum,
    deleteSong,
    DeleteArtist,
    updateAlbum,
    updateArtist,
    updateSong,
    getArtist
} from '../controllers/artist.controller.js';
export const artistRouter = express.Router();
artistRouter.post('/createArtist', upload.single('file'), createArtist);
artistRouter.post('/createAlbum', createAlbum);
artistRouter.post('/createSong', upload.single('file'), createSong);
artistRouter.put('/updateAlbum/:id', updateAlbum);
artistRouter.put('/updateSong/:id', upload.single('file'), updateSong);
artistRouter.put('/updateArtist/:id', upload.single('file'), updateArtist);
artistRouter.delete('/deleteArtist/:id', DeleteArtist);
artistRouter.delete('/deleteAlbum/:id', deleteAlbum);
artistRouter.delete('/deleteSong/:id', deleteSong);
artistRouter.get('/getArtist', getArtist);
