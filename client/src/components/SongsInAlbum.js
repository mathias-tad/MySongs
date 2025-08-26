import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from "@emotion/css";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { createPlayList, setCurrentIndex, setIsEditSongModalOpen, setIsPlaying, setIsDeleteSongModalOpen, } from "../store/artist.slice";
import { toast } from "react-toastify";
import { fetchArtistsStart } from "../store/artist.slice";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import Loading from "./Loading";
import EditSong from "./EditSong";
const SongsInAlbum = ({ mySelectedAlbum }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [songId, setSongId] = useState("");
    const { isDeleteSongModalOpen, isEditSongModalOpen, artists } = useSelector((state) => state.artist);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);
    const handleDelete = async (id) => {
        if (!id)
            return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:1316/api/deleteSong/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                dispatch(fetchArtistsStart());
                dispatch(setIsDeleteSongModalOpen(false));
                toast.success("Song deleted successfully");
            }
            else {
                toast.error("Failed to delete the song");
            }
        }
        catch (error) {
            console.error("Error deleting song:", error);
            toast.error("Something went wrong while deleting the song");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setSelectedAlbum(mySelectedAlbum);
        if ((!isDeleteSongModalOpen || !isDeleteSongModalOpen) &&
            mySelectedAlbum._id) {
            const foundedAlbum = artists
                .flatMap((artist) => artist.albums)
                .find((album) => album._id == mySelectedAlbum._id);
            setSelectedAlbum(foundedAlbum);
        }
    }, [isDeleteSongModalOpen, isEditSongModalOpen, mySelectedAlbum, artists]);
    if (!selectedAlbum?.tracks?.length) {
        return _jsx("div", { children: "No tracks available." });
    }
    return (_jsxs("div", { children: [selectedAlbum.tracks.map((track, idx) => (_jsxs("div", { className: css `
            padding-top: 0;
            margin-top: 0;
            border-bottom: 1px solid #ccc;
            padding: 10px 0;
            text-align: left;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 5px;
            &:hover {
              background-color: #f9f9f9;
              transition: background-color 0.2s;
            }
          `, children: [_jsxs("div", { className: css `
              max-width: 60%;
                cursor: pointer;
                width: 100%;
              &:hover { background-color: #f0f0f0; }
              padding: 5px;
                border-radius: 5px;
                cursor: pointer;
              }
            `, onClick: () => {
                            dispatch(setCurrentIndex(idx));
                            dispatch(createPlayList(selectedAlbum.tracks?.map((t) => ({
                                ...t,
                                artistName: selectedAlbum.artist,
                            })) || []));
                            dispatch(setIsPlaying(true));
                        }, children: [_jsxs("div", { className: css `
                margin: 0;
                font-weight: bold;
                font-size: 16px;
                width: 300px;
                display: flex;
                align-items: center;
                gap: 10px;
              `, children: [_jsx("p", { className: css `
                  max-width: 200px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                `, children: track.title }), " ", "-", " ", _jsxs("p", { className: css `
                  margin: 0;
                  font-weight: lighter;
                  text-align: left;
                `, children: [Math.floor(track.duration / 60), ":", track.duration % 60 < 10
                                                ? "0" + (track.duration % 60)
                                                : track.duration % 60] })] }), _jsxs("p", { className: css `
                margin: 0;
                font-weight: lighter;
                text-align: left;
              `, children: [_jsxs("span", { className: css `
                  font-weight: bold;
                  padding-right: 5px;
                  padding-left: 5px;
                `, children: ["Artist:", " "] }), selectedAlbum.artist] })] }), _jsxs("div", { className: css `
              display: flex;
              align-items: center;
              gap: 10px;
            `, children: [_jsxs("div", { children: [_jsxs("p", { className: css `
                  margin: 0;
                  font-weight: lighter;
                  text-align: left;
                `, children: [_jsxs("span", { className: css `
                    font-weight: bold;
                  `, children: ["Genre:", " "] }), " ", track.genre] }), _jsxs("p", { className: css `
                  margin: 0;
                  font-weight: lighter;
                  text-align: left;
                `, children: [_jsxs("span", { className: css `
                    font-weight: bold;
                  `, children: ["Album:", " "] }), " ", selectedAlbum.title] })] }), _jsxs("div", { children: [_jsx(MdDelete, { className: css `
                  cursor: pointer;
                  &:hover {
                    color: red;
                  }
                `, onClick: () => {
                                            setSongId(track._id);
                                            dispatch(setIsDeleteSongModalOpen(true));
                                        } }), _jsx(MdModeEdit, { className: css `
                  cursor: pointer;
                  &:hover {
                    color: #446ef8;
                  }
                `, onClick: () => {
                                            setSongId(track._id);
                                            const updatedTrack = {
                                                ...track,
                                                artistName: mySelectedAlbum.artist,
                                                album: mySelectedAlbum.title,
                                            };
                                            setSelectedSong(updatedTrack);
                                            dispatch(setIsEditSongModalOpen(true));
                                        } })] })] })] }, track._id))), _jsx(Modal, { isOpen: isDeleteSongModalOpen, onClose: () => dispatch(setIsDeleteSongModalOpen(false)), children: _jsxs("div", { children: [_jsx("h2", { children: "Confirm Deletion" }), _jsx("p", { children: "Are you sure you want to delete this song?" }), _jsx("button", { onClick: () => dispatch(setIsDeleteSongModalOpen(false)), children: "Cancel" }), _jsx("button", { className: css `
              background-color: red;
              color: white;
              margin-left: 10px;
              &:hover {
                background-color: darkred;
              }
            `, onClick: () => {
                                handleDelete(songId);
                            }, children: "Delete" }), loading && (_jsx("div", { className: css `
                margin-top: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-color: rgba(255, 255, 255, 0.8);
              `, children: _jsx(Loading, {}) }))] }) }), _jsx(Modal, { isOpen: isEditSongModalOpen, onClose: () => dispatch(setIsEditSongModalOpen(false)), children: _jsxs("div", { children: [_jsx(EditSong, { selectedSong: selectedSong }), _jsx("button", { className: css `
              font-weight: bold;
              padding: 5px 20px;
              background-color: #ccc;
              font-size: 16px;
              color: #333;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              margin-top: -50px;
              &:hover {
                background-color: #bbb;
                transition: background-color 0.2s;
              }
            `, onClick: () => dispatch(setIsEditSongModalOpen(false)), children: "Cancel" })] }) })] }));
};
export default SongsInAlbum;
//# sourceMappingURL=SongsInAlbum.js.map