import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from "@emotion/css";
import { useState } from "react";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setIsAddSongModalOpen } from "../store/artist.slice";
const AddSong = () => {
    const artists = useSelector((state) => state.artist.artists);
    const [artistName, setArtistName] = useState("");
    const [newArtist, setNewArtist] = useState("");
    const [albumTitle, setAlbumTitle] = useState("");
    const [newAlbum, setNewAlbum] = useState("");
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(0);
    const [genre, setGenre] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [releaseDate, setReleaseDate] = useState("");
    const dispatch = useDispatch();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("artistName", artistName || newArtist);
    formData.append("albumTitle", albumTitle || newAlbum);
    formData.append("title", title);
    formData.append("duration", duration.toString());
    formData.append("genre", genre);
    const submitHandler = async (e) => {
        e.preventDefault();
        setUploading(true);
        let albumRes;
        if (newAlbum) {
            albumRes = await fetch("http://localhost:1316/api/createAlbum", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: artistName ? artistName : newArtist,
                    title: albumTitle || newAlbum,
                    releaseDate,
                }),
            });
            if (!albumRes.ok) {
                toast.error("Failed to Create Song");
                setUploading(false);
                const data = await albumRes.json();
                console.log(data);
                return;
            }
        }
        const res = await fetch("http://localhost:1316/api/createSong", {
            method: "POST",
            body: formData,
        });
        const resData = await res.json();
        if (res.ok) {
            toast.success(resData.message);
            dispatch(setIsAddSongModalOpen(false));
        }
        else {
            toast.error(resData.error || "Failed to upload song");
        }
        setArtistName("");
        setAlbumTitle("");
        setTitle("");
        setDuration(0);
        setGenre("");
        setFile(null);
        setUploading(false);
        setNewAlbum("");
        setNewArtist("");
        setReleaseDate("");
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: css `
          @media (max-width: 600px) {
            padding-top: 100px;
          }
        `, children: [_jsx("h2", { children: "Add A New Song" }), _jsxs("form", { onSubmit: submitHandler, className: css `
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            justify-content: center;
            align-items: start;
          `, children: [_jsxs("label", { children: [_jsxs("p", { className: css `
                self-align: start;
                margin-left: 0;
                margin-bottom: 5px;
                text-align: left;
                font-weight: bold;
              `, children: ["Song:", " ", _jsx("span", { className: css `
                  color: red;
                `, children: "*" })] }), _jsx("input", { type: "file", name: "song", required: true, accept: ".mp3, .wav, .m4a", onChange: (e) => {
                                            setFile(e.target.files[0]);
                                            setTitle(e.target.files[0].name);
                                            const objectUrl = URL.createObjectURL(e.target.files[0]);
                                            const audio = new Audio();
                                            audio.src = objectUrl;
                                            audio.addEventListener("loadedmetadata", () => {
                                                setDuration(audio.duration);
                                                URL.revokeObjectURL(e.target.value);
                                            });
                                        }, className: css `
                display: block;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 0;
                outline: none;
              ` }), _jsx("p", { className: css `
                font-weight: lighter;
                font-size: 12px;
                color: #666;
                margin-top: 5px;
              `, children: "\u26A0\uFE0F Make sure the audio format is among mp3, wav and m4a" })] }), _jsxs("label", { children: [_jsxs("p", { className: css `
                self-align: start;
                margin-left: 0;
                text-align: left;
                font-weight: bold;
                margin-bottom: 5px;
              `, children: ["Song Name:", " ", _jsx("span", { className: css `
                  color: red;
                `, children: "*" })] }), _jsx("input", { type: "text", name: "songName", value: title, onChange: (e) => setTitle(e.target.value), required: true, 
                                        //onChange={(e) => setTitle(e.target.value)}
                                        className: css `
                display: block;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 0;
                outline: none;
              ` })] }), _jsxs("label", { children: [_jsxs("p", { className: css `
                text-align: left;
                font-weight: bold;
                margin-bottom: 5px;
              `, children: ["Artist:", " ", _jsx("span", { className: css `
                  color: red;
                `, children: "*" })] }), _jsxs("select", { name: "artist", id: "", required: !newArtist, onChange: (e) => {
                                            setArtistName(e.target.value);
                                            setNewArtist("");
                                        }, className: css `
                display: block;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 0;
                margin-bottom: 5px;
                outline: none;
              `, children: [_jsx("option", { value: "", children: "Select Artist" }), artists.map((artist) => (_jsx("option", { value: artist.name, children: artist.name }, artist._id)))] }), _jsx("input", { type: "text", name: "artist", placeholder: "Artist Name If not in the list", required: !artistName, onChange: (e) => {
                                            setNewArtist(e.target.value);
                                            setArtistName("");
                                        }, className: css `
                display: block;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 0;
                outline: none;
              ` })] }), _jsxs("label", { children: [_jsxs("p", { className: css `
                self-align: start;
                margin-left: 0;
                text-align: left;
                font-weight: bold;
                margin-bottom: 5px;
              `, children: ["Album Name:", " ", _jsx("span", { className: css `
                  color: red;
                `, children: "*" })] }), _jsxs("select", { name: "albumName", id: "", disabled: !artistName, required: artistName !== "" && !newAlbum, onChange: (e) => {
                                            setAlbumTitle(e.target.value);
                                            setNewAlbum("");
                                        }, value: albumTitle, className: css `
                display: block;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 0;
                margin-bottom: 5px;
                outline: none;
              `, children: [_jsx("option", { value: "", children: "Select Album" }), artists.map((artist) => artist.name == artistName &&
                                                artist.albums.map((album) => (_jsx("option", { value: album.title, children: album.title }, album._id))))] }), _jsx("input", { type: "text", name: "albumName", required: !albumTitle, placeholder: "Enter Album Name If not in the list", onChange: (e) => {
                                            setNewAlbum(e.target.value);
                                            setAlbumTitle("");
                                        }, className: css `
                display: block;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 0;
                outline: none;
              ` })] }), newAlbum && (_jsxs("label", { children: [_jsxs("p", { children: ["Release Date ", _jsx("span", { children: "*" })] }), _jsx("input", { type: "date", required: true, onChange: (e) => setReleaseDate(e.target.value) })] })), _jsxs("label", { children: [_jsxs("p", { className: css `
                text-align: left;
                font-weight: bold;
                margin-bottom: 5px;
              `, children: ["Genre:", " ", _jsx("span", { className: css `
                  color: red;
                `, children: "*" })] }), _jsxs("select", { name: "genre", required: true, 
                                        //onChange={(e) => setReleaseDate(e.target.value)}
                                        onChange: (e) => setGenre(e.target.value), value: genre, className: css `
                display: block;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 0;
                outline: none;
              `, children: [_jsx("option", { value: "", children: "Select Genre" }), _jsx("option", { value: "Pop", children: "Pop" }), _jsx("option", { value: "Rock", children: "Rock" }), _jsx("option", { value: "Hip-Hop", children: "Hip-Hop" }), _jsx("option", { value: "Jazz", children: "Jazz" }), _jsx("option", { value: "Classical", children: "Classical" }), _jsx("option", { value: "Country", children: "Country" }), _jsx("option", { value: "Electronic", children: "Electronic" }), _jsx("option", { value: "Reggae", children: "Reggae" }), _jsx("option", { value: "Blues", children: "Blues" }), _jsx("option", { value: "Folk", children: "Folk" }), _jsx("option", { value: "R&B", children: "R&B" })] })] }), _jsx("button", { type: "submit", className: css `
              font-weight: bold;
              padding: 5px 20px;
              background-color: #446ef8;
              font-size: 16px;
              color: #fff;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              margin-top: 10px;
              &:hover {
                background-color: #365bbf;
                transition: background-color 0.2s;
              }
            `, children: "Add" })] })] }), uploading && (_jsx("div", { className: css `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
          `, children: _jsx(Loading, {}) }))] }));
};
export default AddSong;
//# sourceMappingURL=AddSong.js.map