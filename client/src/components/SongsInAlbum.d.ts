interface Album {
    _id?: string;
    title: string;
    releaseDate: string;
    coverUrl: string | null;
    tracks?: Array<{
        _id?: string;
        title: string;
        duration: number;
        genre: string;
    }>;
    artist?: string;
    createdAt?: string;
}
declare const SongsInAlbum: ({ mySelectedAlbum }: {
    mySelectedAlbum: Album;
}) => import("react/jsx-runtime").JSX.Element;
export default SongsInAlbum;
//# sourceMappingURL=SongsInAlbum.d.ts.map