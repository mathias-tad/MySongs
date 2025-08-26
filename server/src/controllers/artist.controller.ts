import type { Request, Response } from 'express';
import Artist from '../models/artist.model.js';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import type { mongo } from 'mongoose';
import mongoose from 'mongoose';
dotenv.config();

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary configuration variables are missing');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface ITrack {
    _id?: mongoose.Types.ObjectId;
    title: string;
    duration: number;
    genre: string;
    songUrl?: string | undefined | null;
    publicId?: string | undefined | null;
}
interface IAlbum {
    _id?: string;
    title?: string;
    releaseDate?: Date;
    tracks?: ITrack[];
    coverUrl?: string;
}

export const createArtist = async (req: Request, res: Response) => {
    try {
        let url;
        let pid;
        if (req.file) {
            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'image',
                            folder: 'images',
                        },
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                    if (req.file) {
                        stream.end(req.file.buffer);
                    } else {
                        reject(new Error('No file provided'));
                    }
                }
                );
            };
            const result: any = await streamUpload();
            pid = result.public_id;
            url = result.secure_url;
        }

        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const artist = await Artist.findOne({ name });
        if (!artist) {
            const newArtist = new Artist({
                name,
                albums: [],
                genres: [],
                country: null,
                publicId: pid || null,
                imageUrl: url || null,
            });
            await newArtist.save();
            return res.status(201).json({ message: 'New artist created successfully' });
        }
        return res.status(201).json({ message: 'Artist already exist' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to create Artist' });

    }
}
export const createAlbum = async (req: Request, res: Response) => {
    const { name, coverUrl, releaseDate, title } = req.body;
    if (!name || !title) {
        return res.status(400).json({ error: 'Name and title are required' });
    }
    const newAlbum = {
        title,
        releaseDate: new Date(releaseDate),
        coverUrl: coverUrl || null,
        tracks: [],
    };
    interface IAlbum {
        title: string;
        releaseDate: Date;
        coverUrl?: string | null;
        tracks: Array<{
            title: string;
            duration: number;
            genre: string;
        }>;
    }
    try {
        const artistFound = await Artist.findOne({ name });
        if (artistFound) {
            const existingAlbum = artistFound.albums?.find(album => album.title === title);
            if (existingAlbum) {
                return res.status(400).json({ error: 'Album with the same title already exists for this artist' });
            }
            artistFound.albums = artistFound.albums || [];
            (artistFound.albums as IAlbum[]).push(newAlbum);
            await artistFound.save();
        }
        else {
            const artist = new Artist({
                name,
                albums: [newAlbum],
                genres: [],
                country: null,
            });
            await artist.save();
        }
        return res.status(201).json({ message: 'Album created successfully', album: newAlbum });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create album' });
    }
}

// Multer setup for file uploads
// And save data to a database
export const createSong = async (req: Request, res: Response) => {
    //console.log(req.file);
    //console.log(req.body);
    if (!req.file) {
        return res.status(400).json({ error: 'Audio file is required' });
    }
    try {
        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'video',
                        folder: 'songs',
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                if (req.file) {
                    stream.end(req.file.buffer);
                } else {
                    reject(new Error('No file provided'));
                }
            }
            );
        };
        const result: any = await streamUpload();
        const { artistName, albumTitle, title, duration, genre } = req.body;
        if (!artistName || !albumTitle || !title || !duration || !genre) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const artist = await Artist.findOne({ name: artistName });
        if (!artist) {
            const newArtist = new Artist({
                name: artistName,
                albums: [{
                    title: albumTitle,
                    releaseDate: new Date(),
                    coverUrl: null,
                    tracks: [{
                        title,
                        duration: Number(duration),
                        genre,
                        songUrl: result.secure_url,
                        publicId: result.public_id,
                    }],
                }],
                genres: [genre],
                country: null,
            });
            await newArtist.save();
            return res.status(201).json({ message: 'Song and new artist created successfully' });
        }
        let album = artist.albums?.find(album => album.title === albumTitle);
        if (!album) {
            album = {
                title: albumTitle,
                releaseDate: new Date(),
                tracks: [],
            };
            artist.albums = artist.albums || [];
            artist.albums.push(album);
        }
        album.tracks = album.tracks || [];
        album.tracks.push({
            title,
            duration: Number(duration),
            genre,
            songUrl: result.secure_url,
            publicId: result.public_id,
        });
        await artist.save();
        return res.status(201).json({ message: 'Song added successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to upload audio file' });
    }
}
export const updateAlbum = async (req: Request, res: Response) => {
    const { name, coverUrl, releaseDate, title } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Album not selected" })
    }
    if (!name || !title) {
        return res.status(400).json({ error: 'Name and title are required' });
    }

    try {
        const artistFound = await Artist.findOne({ "albums._id": id });
        console.log(id);
        console.log(artistFound);
        if (!artistFound) {
            return res.status(400).json({ error: 'Artist not found' });
        }
        const existingAlbum = artistFound.albums?.find(album => album._id?.toString() === id);
        if (!existingAlbum) {
            return res.status(400).json({ error: 'Album not found' });
        }
        artistFound.name! = name;
        existingAlbum.title = title;
        existingAlbum.releaseDate = new Date(releaseDate);
        await artistFound?.save();

        return res.status(201).json({ message: 'Album Updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update album' });
    }
}
export const updateSong = async (req: Request, res: Response) => {
    const { id } = req.params;
    //console.log(id);

    try {
        const artist = await Artist.findOne({ 'albums.tracks._id': id });
        //console.log(artist);
        if (!artist) {
            return res.status(404).json({ error: 'Song not found' });
        }
        let songToUpdate: ITrack | undefined;
        const { title, duration, genre, artistName, albumTitle } = req.body;
        if (!id || !title || !genre || !artistName || !albumTitle) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        artist.albums?.forEach(album => {
            if (album.title === albumTitle) {
                songToUpdate = album.tracks?.find(track => track._id?.toString() === id);
            }
        });
        //console.log(songToUpdate);
        if (!songToUpdate) {
            return res.status(404).json({ error: 'Song not found' });
        }
        //console.log(req.file);
        if (req.file) {
            if (songToUpdate.publicId) {
                await cloudinary.uploader.destroy(songToUpdate.publicId, { resource_type: 'video' });
            }
            const streamUpload = () => {
                return new Promise<any>((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'video',
                            folder: 'songs',
                        },
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                    if (req.file) {
                        stream.end(req.file.buffer);
                    } else {
                        reject(new Error('No file provided'));
                    }
                });
            };
            const result: any = await streamUpload();
            songToUpdate.songUrl = result.secure_url;
            songToUpdate.publicId = result.public_id;
        }
        songToUpdate.title = title;
        const parsedDuration = parseInt(duration, 10);
        if (isNaN(parsedDuration)) {
            return res.status(400).json({ error: 'Duration must be a valid number' });
        }
        songToUpdate.duration = parsedDuration ? parsedDuration : songToUpdate.duration;
        songToUpdate.genre = genre;
        //console.log(songToUpdate);
        await artist.save();
        return res.status(200).json({ message: 'Song updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to update song' });

    }
}
export const updateArtist = async (req: Request, res: Response) => {
    try {
        if (!req.params) {
            return res.status(400).json({ error: "Artist not selected" })
        }
        const { id } = req.params;
        const artistFound = await Artist.findById(id);
        if (!artistFound) {
            return res.status(400).json({ error: "Artist not found" })
        }
        let url;
        let pid;
        if (req.file) {
            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'image',
                            folder: 'images',
                        },
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                    if (req.file) {
                        stream.end(req.file.buffer);
                    } else {
                        reject(new Error('No file provided'));
                    }
                }
                );
            };
            const result: any = await streamUpload();
            if (artistFound?.publicId && req.file) {
                await cloudinary.uploader.destroy(artistFound.publicId, { resource_type: 'image' });
            }
            pid = result.public_id;
            url = result.secure_url;
        }

        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        artistFound.name = name;
        artistFound.imageUrl = url ? url : artistFound.imageUrl;
        artistFound.publicId = pid ? url : artistFound.publicId;
        await artistFound.save();
        return res.status(201).json({ message: 'Artist updated successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to update Artist' });

    }
}
export const DeleteArtist = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Artist ID is required' });
        }
        const artist = await Artist.findOne({ _id: id });
        if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
        }

        let publicIdsForTrack: string[] = [];

        artist.albums?.forEach((album) => {
            album.tracks?.forEach((track) => {
                if (track.publicId) publicIdsForTrack.push(track.publicId)
            })
        })

        if (publicIdsForTrack.length > 0) {
            for (const publicId of publicIdsForTrack) {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
            }
        }
        if (artist.publicId) {
            await cloudinary.uploader.destroy(artist.publicId, { resource_type: 'image' });
        }
        await Artist.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Artist deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete artist' });
    }
}
export const deleteAlbum = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Album ID is required' });
        }
        const artist = await Artist.findOne({ 'albums._id': id });
        if (!artist) {
            return res.status(404).json({ error: 'Album not found' });
        }

        let albumToDelete: IAlbum | undefined;
        let publicIdsForTrack: string[] = [];
        artist.albums = artist.albums?.filter(album => {
            if (album._id?.toString() === id) {
                albumToDelete = album;
                return false; // Remove this album
            }
            return true; // Keep this album
        }) || [];
        if (!albumToDelete) {
            return res.status(404).json({ error: 'Album not found' });
        }
        albumToDelete.tracks?.forEach(track => {
            if (track.publicId) publicIdsForTrack.push(track.publicId)
        });
        if (publicIdsForTrack.length > 0) {
            for (const publicId of publicIdsForTrack) {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
            }
        }
        await artist.save();
        return res.status(200).json({ message: 'Song deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete song' });
    }
}
export const deleteSong = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Song ID is required' });
        }
        const artist = await Artist.findOne({ 'albums.tracks._id': id });
        if (!artist) {
            return res.status(404).json({ error: 'Song not found' });
        }

        let songToDelete: ITrack | undefined;
        artist.albums?.forEach(album => {
            album.tracks = album.tracks?.filter(track => {
                if (track._id?.toString() === id) {
                    songToDelete = track;
                    return false; // Remove this track
                }
                return true; // Keep this track
            }) || [];
        });
        if (!songToDelete) {
            return res.status(404).json({ error: 'Song not found' });
        }
        if (songToDelete.publicId) {
            await cloudinary.uploader.destroy(songToDelete.publicId, { resource_type: 'video' });
        }
        await artist.save();
        return res.status(200).json({ message: 'Song deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete song' });
    }
}
export const getArtist = async (req: Request, res: Response) => {
    try {
        const artists = await Artist.find({});
        //console.log(artists);
        return res.status(200).json(artists);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch artists' });
    }
}