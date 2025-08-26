import React from "react";
type Song = {
    _id?: string;
    title: string;
    duration: number;
    genre: string;
    artistName: string;
    album: string;
    songUrl?: string;
    publicId?: string;
};
type SongsProps = {
    selectedSong: Song | null;
};
declare const EditSong: React.FC<SongsProps>;
export default EditSong;
//# sourceMappingURL=EditSong.d.ts.map