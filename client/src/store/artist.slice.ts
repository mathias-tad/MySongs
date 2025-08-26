import { createSlice } from '@reduxjs/toolkit';

interface Artist {
    _id: string;
    name: string;
    genres: string[];
    country: string | null;
    albums: Array<{
        title: string;
        releaseDate: string;
        coverUrl: string | null;
        tracks: Array<{
            title: string;
            duration: number;
            genre: string;
        }>;
    }>;
}

interface PlayListItem {
    songUrl?: string;
    title?: string;
    artistName?: string;
}

interface Song {
    _id: string;
    title: string;
    duration: number;
    genre: string;
    artist: string;
    album: string;
    songUrl?: string;
    publicId?: string;
};

interface ArtistState {
    artists: Artist[];
    loading: boolean;
    error: string | null;
    playList?: PlayListItem[];
    currentIndex?: number;
    isPlaying?: boolean;
    songs?: Song[];
    currentTime?: number;
    isDeleteModalOpen: boolean;
    isDeleteSongModalOpen: boolean;
    isEditModalOpen: boolean;
    isEditSongModalOpen: boolean;
    isAddSongModalOpen: boolean;
    isDeleteArtist: boolean;
    isAddArtist: boolean;
    isEditArtist: boolean;
    selectedGenre: string;
    searchString: string;
}

const artistSlice = createSlice({
    name: 'artist',
    initialState: {
        artists: [],
        loading: false,
        error: null,
        currentIndex: 0,
        playList: [],
        isPlaying: false,
        songs: [],
        currentTime: 0,
        isDeleteModalOpen: false,
        isEditModalOpen: false,
        isDeleteSongModalOpen: false,
        isEditSongModalOpen: false,
        isAddSongModalOpen: false,
        isDeleteArtist: false,
        isAddArtist: false,
        isEditArtist: false,
        selectedGenre: "",
        searchString: "",
    } as ArtistState,
    reducers: {
        fetchArtistsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchArtistsSuccess(state, action) {
            state.loading = false;
            state.artists = action.payload;
        },
        fetchArtistsFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        createPlayList(state, action) {
            state.playList = action.payload;
        },
        setCurrentIndex(state, action) {
            state.currentIndex = action.payload;
        },
        setIsPlaying(state, action) {
            state.isPlaying = action.payload;
        },
        createSongs(state, action) {
            state.songs = action.payload;
        },
        setCurrentTime(state, action) {
            state.currentTime = action.payload;
        },
        setIsDeleteModalOpen(state, action) {
            state.isDeleteModalOpen = action.payload;
        },
        setIsEditModalOpen(state, action) {
            state.isEditModalOpen = action.payload;
        },
        setIsDeleteSongModalOpen(state, action) {
            state.isDeleteSongModalOpen = action.payload;
        },
        setIsEditSongModalOpen(state, action) {
            state.isEditSongModalOpen = action.payload;
        },
        setIsAddSongModalOpen(state, action) {
            state.isAddSongModalOpen = action.payload;
        },
        setIsDeleteArtist(state, action) {
            state.isDeleteArtist = action.payload;
        },
        setIsAddArtist(state, action) {
            state.isAddArtist = action.payload;
        },
        setIsEditArtist(state, action) {
            state.isEditArtist = action.payload;
        },
        setSelectedGenre(state, action) {
            state.selectedGenre = action.payload;
        },
        setSearchString(state, action) {
            state.searchString = action.payload
        }
    },
});
export const { fetchArtistsStart, fetchArtistsSuccess, fetchArtistsFailure, createPlayList, setCurrentIndex, setIsPlaying, createSongs, setCurrentTime, setIsDeleteModalOpen, setIsEditModalOpen, setIsDeleteSongModalOpen, setIsEditSongModalOpen, setIsAddSongModalOpen, setIsDeleteArtist, setIsAddArtist, setIsEditArtist, setSelectedGenre, setSearchString } = artistSlice.actions;
export default artistSlice.reducer;