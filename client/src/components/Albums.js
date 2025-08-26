import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from "@emotion/css";
import { IoIosAdd } from "react-icons/io";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchArtistsStart, setIsEditModalOpen } from "../store/artist.slice";
import Loading from "./Loading";
import SongsInAlbum from "./SongsInAlbum";
import { IoArrowBack } from "react-icons/io5";
import { setIsDeleteModalOpen } from "../store/artist.slice";
function Albums() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const dispatch = useDispatch();
    const artists = useSelector((state) => state.artist.artists);
    const { loading, isDeleteModalOpen, isEditModalOpen } = useSelector((state) => state.artist);
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [loadding, setLoading] = useState(false);
    const handleDelete = async () => {
        if (!selectedAlbum?._id)
            return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:1316/api/deleteAlbum/${selectedAlbum?._id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                dispatch(fetchArtistsStart());
                dispatch(setIsDeleteModalOpen(false));
                toast.success("Album deleted successfully");
            }
            else {
                toast.error("Failed to delete the Album");
            }
        }
        catch (error) {
            console.error("Error deleting Album:", error);
            toast.error("Something went wrong while deleting the Album");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        // Fetch artists when the component mounts
        dispatch(fetchArtistsStart());
        setAlbums([]);
        artists.forEach((artist) => {
            artist.albums.forEach((album) => {
                const updatedAlbum = {
                    ...album,
                    artist: artist.name,
                    createdAt: artist.createdAt,
                };
                setAlbums((prevAlbums) => [...prevAlbums, updatedAlbum]);
            });
        });
        if (isEditModalOpen) {
            setName(selectedAlbum?.artist);
            setTitle(selectedAlbum?.title);
            setReleaseDate(selectedAlbum?.releaseDate.split("T")[0]);
        }
        else {
            setName("");
            setTitle("");
            setReleaseDate("");
        }
    }, [
        dispatch,
        isModalOpen,
        isDeleteModalOpen,
        isEditModalOpen,
        selectedAlbum,
    ]);
    const submitHandler = async (e) => {
        e.preventDefault();
        let res;
        if (!isEditModalOpen) {
            res = await fetch("http://localhost:1316/api/createAlbum", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    title,
                    releaseDate,
                    coverUrl,
                }),
            });
        }
        else {
            res = await fetch(`http://localhost:1316/api/updateAlbum/${selectedAlbum?._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    title,
                    releaseDate,
                    coverUrl,
                }),
            });
        }
        const data = await res?.json();
        if (res?.ok) {
            toast.success(`${isEditModalOpen
                ? "Album updated successfully"
                : "Album created successfully"}`);
            setIsModalOpen(false);
            setName("");
            setTitle("");
            setReleaseDate("");
            setCoverUrl("");
            dispatch(setIsEditModalOpen(false));
            dispatch(fetchArtistsStart());
        }
        else if (res?.status === 400) {
            //console.error("Failed to create album:", data.error);
            toast.error(data.error);
        }
        else {
            //console.error("Failed to create album:", data.error);
            toast.error(`${isEditModalOpen ? "Failed to update album" : "Failed to create album"}`);
        }
    };
    return (_jsxs("div", { className: css `
        color: #000;
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        gap: 10px;
        padding: 10px;
      `, children: [_jsx("div", { className: css `
          width: 100%;
          display: flex;
          justify-content: end;
          position: sticky;
          top: 0;
          right: 0;
          z-index: 10;
        `, children: _jsxs("p", { onClick: () => setIsModalOpen(true), className: css `
            position: sticky;
            top: 0;
            right: 0;
            background-color: #446ef8;
            padding: 5px;
            color: #fff;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            &:hover {
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              transition: box-shadow 0.2s;
            }
          `, children: [_jsx(IoIosAdd, {}), _jsx("span", { children: "Create Album" })] }) }), loading && _jsx(Loading, {}), !albums.length && !loading && (_jsx("p", { className: css `
            width: 100%;
            text-align: center;
          `, children: "No Albums Available" })), !loading &&
                !selectedAlbum?.title &&
                albums.map((album) => (_jsx("div", { onClick: () => setSelectedAlbum(album), className: css `
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              margin: 10px;
              width: fit-content;
              padding: 10px;
              cursor: pointer;
              &:hover {
                transform: scale(1.01);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                transition: transform 0.2s, box-shadow 0.2s;
              }
            `, children: _jsxs("div", { className: css `
                display: flex;
                flex-direction: column;
                gap: 2px;
              `, children: [_jsxs("p", { className: css `
                  margin: 0;
                  text-align: left;
                  font-size: 1.2em;
                `, children: [_jsx("span", { className: css `
                    font-weight: bold;
                  `, children: "Title:" }), " ", album.title] }), _jsxs("p", { className: css `
                  margin: 0;
                  text-align: left;
                `, children: [_jsx("span", { className: css `
                    font-weight: bold;
                  `, children: "Artist:" }), " ", album.artist] }), _jsxs("p", { className: css `
                  margin: 0;
                  text-align: left;
                `, children: [_jsx("span", { className: css `
                    font-weight: bold;
                  `, children: "Released:" }), " ", album.releaseDate.split("T")[0]] }), _jsxs("p", { className: css `
                  margin: 0;
                  margin-top: 5px;
                  text-align: right;
                  color: #666;
                  font-size: 0.9em;
                `, children: [album.tracks?.length, " Tracks"] })] }) }, album._id))), selectedAlbum?.title && (_jsxs("div", { className: css `
            padding: 10px;
            width: 100%;
            padding-top: 0;
          `, children: [_jsxs("div", { className: css `
              display: flex;
              align-items: center;
              gap: 20px;
            `, children: [_jsxs("button", { onClick: () => setSelectedAlbum(null), className: css `
                background-color: #446ef8;
                padding: 5px 10px;
                color: #fff;
                border-radius: 5px;
                cursor: pointer;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 5px;
                border: none;
                font-size: 16px;
                font-weight: bold;
                &:hover {
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                  transition: box-shadow 0.2s;
                }
              `, children: [_jsx(IoArrowBack, {}), " Back to Albums"] }), _jsx("p", { className: css `
                font-weight: thinner;
                margin: 0;
                &:hover {
                  color: red;
                  cursor: pointer;
                }
                text-align: right;
              `, onClick: () => dispatch(setIsDeleteModalOpen(true)), children: "Delete Album" }), _jsx("p", { className: css `
                font-weight: thinner;
                margin: 0;
                &:hover {
                  color: #446ef8;
                  cursor: pointer;
                  text-align: right;
                }
              `, onClick: () => {
                                    dispatch(setIsEditModalOpen(true));
                                    setIsModalOpen(true);
                                }, children: "Edit Album" })] }), _jsx(SongsInAlbum, { mySelectedAlbum: selectedAlbum })] })), _jsx(Modal, { isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    dispatch(setIsEditModalOpen(false));
                }, children: _jsxs("div", { children: [_jsx("h2", { children: `${isEditModalOpen ? "Edit Album" : "Create Album"}` }), _jsxs("form", { onSubmit: submitHandler, className: css `
              display: flex;
              flex-direction: column;
              gap: 10px;
              padding: 20px;
              justify-content: center;
              align-items: start;
            `, children: [_jsxs("label", { children: [_jsxs("p", { className: css `
                  self-align: start;
                  margin-left: 0;
                  text-align: left;
                  font-weight: bold;
                  margin-bottom: 5px;
                `, children: ["Album Name:", " ", _jsx("span", { className: css `
                    color: red;
                  `, children: "*" })] }), _jsx("input", { type: "text", name: "albumName", required: true, value: title, onChange: (e) => setTitle(e.target.value), className: css `
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
                  `, children: "*" })] }), _jsx("input", { type: "text", name: "artist", required: true, value: name, onChange: (e) => setName(e.target.value), className: css `
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
                `, children: ["Release Date:", " ", _jsx("span", { className: css `
                    color: red;
                  `, children: "*" })] }), _jsx("input", { type: "date", name: "releaseDate", value: releaseDate, required: true, onChange: (e) => setReleaseDate(e.target.value), className: css `
                  display: block;
                  width: 100%;
                  padding: 8px;
                  border-radius: 4px;
                  border: 1px solid #ccc;
                  margin-left: 0;
                  outline: none;
                ` })] }), _jsx("button", { type: "submit", className: css `
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
              `, children: isEditModalOpen ? "Save" : "Create Album" })] })] }) }), _jsx(Modal, { isOpen: isDeleteModalOpen, onClose: () => dispatch(setIsDeleteModalOpen(false)), children: _jsxs("div", { children: [_jsx("h2", { children: "Confirm Deletion" }), _jsx("p", { children: "Are you sure you want to delete this Album?" }), _jsx("button", { onClick: () => dispatch(setIsDeleteModalOpen(false)), children: "Cancel" }), _jsx("button", { className: css `
              background-color: red;
              color: white;
              margin-left: 10px;
              &:hover {
                background-color: darkred;
              }
            `, onClick: () => {
                                handleDelete();
                            }, children: "Delete" }), (loading || loadding) && (_jsx("div", { className: css `
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
              `, children: _jsx(Loading, {}) }))] }) }), _jsx("p", { className: css `
          position: fixed;
          bottom: 10px;
          right: 50px;
          color: #666;
          font-size: 0.9em;
        `, children: !selectedAlbum?.title
                    ? `Total Albums: ${albums.length}`
                    : `Total Songs: ${selectedAlbum.tracks?.length || 0}` })] }));
}
export default Albums;
//# sourceMappingURL=Albums.js.map