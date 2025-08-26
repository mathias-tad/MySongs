import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { css } from "@emotion/css";
import { IoIosAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import SongsInAlbum from "./SongsInAlbum";
import { fetchArtistsStart, setIsAddArtist, setIsDeleteArtist, setIsEditArtist, } from "../store/artist.slice";
import { setIsDeleteModalOpen } from "../store/artist.slice";
import { toast } from "react-toastify";
import Modal from "./Modal";
import AddOrEditArtist from "./AddOrEditArtist";
import DeleteArtist from "./DeleteArtist";
import placeHolder from "../assets/PlaceHolder.png";
const Artists = () => {
    const artists = useSelector((state) => state.artist.artists);
    const { loading } = useSelector((state) => state.artist);
    const { isDeleteModalOpen, isEditModalOpen } = useSelector((state) => state.artist);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [artistName, setArtistName] = useState("");
    const dispatch = useDispatch();
    const [loadding, setLoading] = useState(false);
    const { isDeleteArtist, isAddArtist, isEditArtist } = useSelector((state) => state.artist);
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
                setSelectedAlbum(null);
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
        dispatch(fetchArtistsStart());
    }, [dispatch, isDeleteModalOpen, isEditModalOpen]);
    return (_jsxs("div", { children: [_jsx("div", { className: css `
          width: 100%;
          display: flex;
          justify-content: end;
          position: sticky;
          top: 0;
          right: 0;
          z-index: 10;
        `, children: _jsxs("p", { 
                    //onClick={() => setIsModalOpen(true)}
                    className: css `
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
          `, onClick: () => dispatch(setIsAddArtist(true)), children: [_jsx(IoIosAdd, {}), _jsx("span", { children: "New Artist" })] }) }), !artists.length && !loading && _jsx("p", { children: "No artists" }), " ", (loading || loadding) && _jsx(Loading, {}), _jsx("div", { className: css `
          width: 100%;
          display: flex;
          flex-wrap: wrap;
        `, children: !loading &&
                    artists.length &&
                    !selectedArtist?._id &&
                    !selectedAlbum?._id &&
                    artists.map((artist) => (_jsxs("div", { className: css `
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                margin: 10px;
                width: 200px;
                min-height: 200px;
                padding: 10px;
                cursor: pointer;
                &:hover {
                  transform: scale(1.01);
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                  transition: transform 0.2s, box-shadow 0.2s;
                }
              `, onClick: () => {
                            setSelectedArtist(artist);
                            setArtistName(artist.name);
                        }, children: [_jsx("img", { src: artist.imageUrl || placeHolder, alt: "Artist picture", className: css `
                  min-width: 130px;
                  max-width: 130px;
                  min-height: 120px;
                  max-height: 120px;
                ` }), _jsxs("div", { children: [_jsxs("p", { children: [_jsxs("span", { className: css `
                      font-weight: bold;
                    `, children: ["Name:", " "] }), artist.name] }), _jsxs("p", { children: [_jsxs("span", { className: css `
                      font-weight: bold;
                    `, children: ["Albums:", " "] }), artist.albums?.length] })] })] }, artist._id))) }), selectedArtist && !selectedAlbum && (_jsxs("div", { className: css `
            display: flex;
            align-items: center;
            gap: 10px;
            padding-left: 10px;
          `, children: [_jsxs("button", { onClick: () => setSelectedArtist(null), className: css `
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
            `, children: [_jsx(IoArrowBack, {}), " Back to Artists"] }), _jsx("p", { className: css `
              font-weight: thinner;
              margin: 0;
              &:hover {
                color: red;
                cursor: pointer;
              }
              text-align: right;
            `, onClick: () => dispatch(setIsDeleteArtist(true)), children: "Delete Artist" }), _jsx("p", { className: css `
              font-weight: thinner;
              margin: 0;
              &:hover {
                color: #446ef8;
                cursor: pointer;
                text-align: right;
              }
            `, onClick: () => dispatch(setIsEditArtist(true)), children: "Edit Artist" })] })), _jsxs("div", { className: css `
          display: flex;
          flex-wrap: wrap;
        `, children: [!selectedArtist?.albums.length && selectedArtist?._id && (_jsx("p", { className: css `
              width: 100%;
              text-align: center;
            `, children: "No Albums Available" })), !loading &&
                        selectedArtist?._id &&
                        !selectedAlbum &&
                        selectedArtist.albums.map((album) => (_jsx("div", { onClick: () => setSelectedAlbum(album), className: css `
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
                    `, children: "Artist:" }), " ", artistName] }), _jsxs("p", { className: css `
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
                `, onClick: handleDelete, children: "Delete Album" })] }), _jsx(SongsInAlbum, { mySelectedAlbum: selectedAlbum })] }))] }), _jsx("p", { className: css `
          position: fixed;
          bottom: 10px;
          right: 50px;
          color: #666;
          font-size: 0.9em;
        `, children: !selectedArtist && !selectedAlbum //!selectedAlbum?.title
                    ? `Total Artist: ${artists.length}`
                    : selectedArtist && !selectedAlbum
                        ? `Total Album: ${selectedArtist.albums.length}`
                        : `Total Songs: ${selectedAlbum?.tracks.length || 0}` }), _jsx(Modal, { isOpen: isDeleteArtist, onClose: () => dispatch(setIsDeleteArtist(false)), children: _jsx(DeleteArtist, { id: selectedArtist?._id }) }), _jsx(Modal, { isOpen: isAddArtist, onClose: () => dispatch(setIsAddArtist(false)), children: _jsx(AddOrEditArtist, { artist: selectedArtist }) }), _jsx(Modal, { isOpen: isEditArtist, onClose: () => dispatch(setIsEditArtist(false)), children: _jsx(AddOrEditArtist, { artist: selectedArtist }) })] }));
};
export default Artists;
//# sourceMappingURL=Artists.js.map