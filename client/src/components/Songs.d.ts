type Song = {
    _id: string;
    title: string;
    duration: number;
    genre: string;
    artistName: string;
    album: string;
    songUrl?: string;
    publicId?: string;
};
type SongsProps = {
    songs: Song[];
};
declare const Songs: React.FC<SongsProps>;
export default Songs;
//# sourceMappingURL=Songs.d.ts.map