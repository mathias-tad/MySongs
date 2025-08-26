import mongoose, { Document, Schema, Model } from "mongoose";

interface ITrack {
    _id?: mongoose.Types.ObjectId;
    title: string;
    duration: number; // in seconds
    genre: string;
    songUrl?: string | null | undefined
    publicId?: string | null;
}

interface IAlbum {
    _id?: string;
    title?: string;
    releaseDate?: Date;
    tracks?: ITrack[];
    coverUrl?: string;
}

export interface IArtist extends Document {
    name: string;
    country?: string;
    genres?: string[];
    albums?: IAlbum[];
    createdAt: Date;
    updatedAt: Date;
    publicId?: string;
    imageUrl?: string;
}

const truckSchema: Schema<ITrack> = new Schema({
    title: { type: String },
    duration: { type: Number },
    genre: { type: String, default: null },
    songUrl: { type: String, default: null },
    publicId: { type: String, default: null },
});

const albumSchema: Schema<IAlbum> = new Schema({
    title: { type: String },
    releaseDate: { type: Date },
    tracks: [truckSchema],
    coverUrl: { type: String, default: null },
});

const artistSchema: Schema<IArtist> = new Schema({
    name: { type: String, required: true },
    country: { type: String, default: null },
    publicId: { type: String, default: null },
    imageUrl: { type: String, default: null },
    genres: { type: [String], default: [] },
    albums: [albumSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Artist: Model<IArtist> = mongoose.model<IArtist>("Artist", artistSchema);
export default Artist;
