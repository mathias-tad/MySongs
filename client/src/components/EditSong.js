import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from "@emotion/css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { fetchArtistsStart } from "../store/artist.slice";
const EditSong = ({ selectedSong }) => {
    const artists = useSelector((state) => state.artist.artists);
    const [artistName, setArtistName] = useState("");
    const [newArtistName, setNewArtistName] = useState("");
    const [albumTitle, setAlbumTitle] = useState("");
    const [newAlbumTitle, setNewAlbumTitle] = useState("");
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(0);
    const [genre, setGenre] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    useEffect(() => {
        if (selectedSong) {
            setArtistName(selectedSong.artistName);
            setAlbumTitle(selectedSong.album);
            setTitle(selectedSong.title);
            setDuration(selectedSong.duration);
            setGenre(selectedSong.genre);
        }
    }, [selectedSong]);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("artistName", artistName || newArtistName);
    formData.append("albumTitle", albumTitle || newAlbumTitle);
    formData.append("title", title);
    formData.append("genre", genre);
    const dispatch = useDispatch();
    const submitHandler = async (e) => {
        e.preventDefault();
        setUploading(true);
        if (file) {
            formData.append("duration", duration.toString());
        }
        try {
            const res = await fetch(`http://localhost:1316/api/updateSong/${selectedSong?._id}`, {
                method: "PUT",
                body: formData,
            });
            const resData = await res.json();
            if (res.ok) {
                toast.success(resData.message);
            }
            else {
                toast.error(resData.error || "Failed to save changes");
            }
            setArtistName("");
            setAlbumTitle("");
            setTitle("");
            setDuration(0);
            setGenre("");
            setFile(null);
            dispatch(fetchArtistsStart());
        }
        catch (error) {
            console.error("Error:", error);
            toast.error("Server Error: Unable to update song");
        }
        finally {
            setUploading(false);
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: css `
          @media (max-width: 600px) {
            padding-top: 100px;
          }
        `, children: [_jsx("h2", { children: "Update Song Detail" }), _jsxs("form", { onSubmit: submitHandler, className: css `
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            padding-bottom: 0;
            justify-content: center;
            align-items: start;
            margin-bottom: -20px;
          `, children: [_jsxs("label", { children: [_jsx("p", { className: css `
                self-align: start;
                margin-left: 0;
                margin-bottom: 5px;
                text-align: left;
                font-weight: bold;
              `, children: "Current Song:" }), _jsx("audio", { controls: true, children: _jsx("source", { src: selectedSong?.songUrl, type: "audio/mpeg" }) })] }), _jsxs("label", { children: [_jsxs("p", { className: css `
                self-align: start;
                margin-left: 0;
                margin-bottom: 5px;
                text-align: left;
                font-weight: bold;
              `, children: ["New Song:", " "] }), _jsx("input", { type: "file", name: "song", accept: ".mp3, .wav, .m4a", onChange: (e) => {
                                            setFile(e.target.files[0]);
                                            setTitle(e.target.files[0].name);
                                            if (!e.target.files[0])
                                                return;
                                            const objectUrl = URL.createObjectURL(e.target.files[0]);
                                            const audio = new Audio();
                                            audio.src = objectUrl;
                                            audio.addEventListener("loadedmetadata", () => {
                                                if (e.target.files[0]) {
                                                    setDuration(audio.duration);
                                                }
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
                `, children: "*" })] }), _jsxs("select", { name: "artist", id: "", value: artistName, required: !newArtistName, onChange: (e) => {
                                            setArtistName(e.target.value);
                                            setNewArtistName("");
                                        }, className: css `
                display: block;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 0;
                margin-bottom: 5px;
                outline: none;
              `, children: [_jsx("option", { value: "", children: "Select Artist" }), artists.map((artist) => (_jsx("option", { value: artist.name, children: artist.name }, artist._id)))] }), _jsx("input", { type: "text", name: "artist", placeholder: "Artist Name If not in the list", required: !artistName, value: newArtistName, onChange: (e) => {
                                            setArtistName("");
                                            setNewArtistName(e.target.value);
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
                `, children: "*" })] }), _jsxs("select", { name: "albumName", id: "", disabled: !artistName, required: !newAlbumTitle, onChange: (e) => {
                                            setAlbumTitle(e.target.value);
                                            setNewAlbumTitle("");
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
                                                artist.albums.map((album) => (_jsx("option", { value: album.title, children: album.title }, album._id))))] }), _jsx("input", { type: "text", name: "albumName", required: !albumTitle, value: newAlbumTitle, placeholder: "Enter Album Name If not in the list", onChange: (e) => {
                                            setAlbumTitle("");
                                            setNewAlbumTitle(e.target.value);
                                        }, className: css `
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
            `, children: "Save" })] })] }), uploading && (_jsx("div", { className: css `
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
export default EditSong;
//# sourceMappingURL=EditSong.js.map