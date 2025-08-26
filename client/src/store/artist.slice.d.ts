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
}
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
export declare const fetchArtistsStart: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"artist/fetchArtistsStart">, fetchArtistsSuccess: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/fetchArtistsSuccess">, fetchArtistsFailure: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/fetchArtistsFailure">, createPlayList: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/createPlayList">, setCurrentIndex: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setCurrentIndex">, setIsPlaying: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setIsPlaying">, createSongs: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/createSongs">, setCurrentTime: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setCurrentTime">, setIsDeleteModalOpen: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setIsDeleteModalOpen">, setIsEditModalOpen: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setIsEditModalOpen">, setIsDeleteSongModalOpen: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setIsDeleteSongModalOpen">, setIsEditSongModalOpen: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setIsEditSongModalOpen">, setIsAddSongModalOpen: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setIsAddSongModalOpen">, setIsDeleteArtist: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setIsDeleteArtist">, setIsAddArtist: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setIsAddArtist">, setIsEditArtist: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setIsEditArtist">, setSelectedGenre: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setSelectedGenre">, setSearchString: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "artist/setSearchString">;
declare const _default: import("redux").Reducer<ArtistState>;
export default _default;
//# sourceMappingURL=artist.slice.d.ts.map