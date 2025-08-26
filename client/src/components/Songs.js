import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { css } from "@emotion/css";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPlayList, setIsPlaying, setCurrentIndex, setSelectedGenre, } from "../store/artist.slice";
import { toast } from "react-toastify";
import { fetchArtistsStart } from "../store/artist.slice";
import Loading from "./Loading";
import EditSong from "./EditSong";
import { highlightMatch } from "./highlightMatch";
const Songs = ({ songs }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const dispatch = useDispatch();
    const [songId, setSongId] = useState("");
    const [loading, setLoading] = useState(false);
    const [songToEdit, setSongToEdit] = useState(null);
    const [filteredSong, setFilteredSong] = useState(null);
    const { selectedGenre, searchString } = useSelector((state) => state.artist);
    useEffect(() => {
        if (!searchString) {
            setFilteredSong(selectedGenre
                ? songs?.filter((song) => song.genre == selectedGenre)
                : songs);
        }
        else {
            dispatch(setSelectedGenre(""));
            setFilteredSong(songs?.filter((song) => {
                const searchTerm = searchString.toLowerCase();
                return (song.title?.toLowerCase().includes(searchTerm) ||
                    song.artistName?.toLowerCase().includes(searchTerm) ||
                    song.album?.toLowerCase().includes(searchTerm));
            }));
        }
    }, [songs, selectedGenre, searchString]);
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
                setIsDeleteModalOpen(false);
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
    return (_jsxs("div", { children: [filteredSong?.length === 0 && _jsx("div", { children: "No Songs Available" }), filteredSong &&
                filteredSong?.map((song, index) => (_jsxs("div", { className: css `
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
                                dispatch(createPlayList(songs));
                                dispatch(setIsPlaying(true));
                                dispatch(setCurrentIndex(index));
                            }, children: [_jsx("p", { className: css `
                  font-weight: bold;
                  font-size: 20px;
                  margin-bottom: 5px;
                  max-width: 400px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                `, children: highlightMatch(song.title, searchString) }), _jsxs("p", { className: css `
                  margin-top: 5px;
                  margin-left: 10px;
                  font-weight: lighter;
                  text-align: left;
                `, children: [_jsxs("span", { className: css `
                    font-weight: bold;
                    padding-right: 5px;
                    padding-left: 5px;
                  `, children: ["Artist:", " "] }), highlightMatch(song.artistName, searchString)] })] }), _jsxs("div", { className: css `
                display: flex;
                gap: 15px;
                align-items: center;
                flex-wrap: wrap;
                @media (max-width: 600px) {
                  gap: 0;
                  flex-wrap: wrap;
                  padding-top: 0;
                  padding-bottom: 0;
                }
              `, children: [_jsxs("p", { children: [_jsxs("span", { className: css `
                    font-weight: bold;
                    margin-bottom: 0;
                    margin-top: 0;
                    padding-top: 0;
                    padding-bottom: 0;
                  `, children: ["Album:", " "] }), " ", _jsx("span", { children: highlightMatch(song.album, searchString) })] }), _jsxs("p", { children: [_jsxs("span", { className: css `
                    font-weight: bold;
                    margin-top: 0;
                    margin-bottom: 0;
                    padding-top: 0;
                    padding-bottom: 0;
                  `, children: ["Genre:", " "] }), " ", song.genre] }), _jsx("p", { children: song.duration }), _jsx(MdDelete, { className: css `
                  cursor: pointer;
                  &:hover {
                    color: red;
                  }
                `, onClick: () => {
                                        setIsDeleteModalOpen(true);
                                        setSongId(song._id);
                                    } }), _jsx(MdModeEdit, { className: css `
                  cursor: pointer;
                  &:hover {
                    color: #446ef8;
                  }
                `, onClick: () => {
                                        setIsEditModalOpen(true);
                                        setSongToEdit(song);
                                    } })] })] }, song._id))), _jsxs("p", { className: css `
          position: fixed;
          bottom: 10px;
          right: 50px;
          color: #666;
          font-size: 0.9em;
          background-color: #f9f9f9;
          width: auto;
          padding: 5px 10px;
          border-radius: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        `, children: [filteredSong?.length, " Total Tracks"] }), _jsx(Modal, { isOpen: isDeleteModalOpen, onClose: () => setIsDeleteModalOpen(false), children: _jsxs("div", { children: [_jsx("h2", { children: "Confirm Deletion" }), _jsx("p", { children: "Are you sure you want to delete this song?" }), _jsx("button", { onClick: () => setIsDeleteModalOpen(false), children: "Cancel" }), _jsx("button", { className: css `
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
              `, children: _jsx(Loading, {}) }))] }) }), _jsx(Modal, { isOpen: isEditModalOpen, onClose: () => setIsEditModalOpen(false), children: _jsxs("div", { children: [_jsx(EditSong, { selectedSong: songToEdit }), _jsx("button", { className: css `
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
            `, onClick: () => setIsEditModalOpen(false), children: "Cancel" })] }) })] }));
};
export default Songs;
//# sourceMappingURL=Songs.js.map