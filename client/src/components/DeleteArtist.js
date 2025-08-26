import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Loading from "./Loading";
import { fetchArtistsStart, setIsDeleteArtist } from "../store/artist.slice";
import { useDispatch, useSelector } from "react-redux";
import { css } from "@emotion/css";
import { toast } from "react-toastify";
import { useState } from "react";
const DeleteArtist = ({ id }) => {
    const dispatch = useDispatch();
    const [loadding, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:1316/api/deleteArtist/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("Artist Deleted");
                dispatch(fetchArtistsStart());
                dispatch(setIsDeleteArtist(false));
            }
            else {
                const data = await res.json();
                toast.error(data?.error);
            }
        }
        catch (error) {
            toast.error("Server Error Unable to delete artist");
        }
        finally {
            setLoading(false);
        }
    };
    const { loading } = useSelector((state) => state.artist);
    return (_jsxs("div", { children: [_jsx("h2", { children: "Confirm Deletion" }), _jsx("p", { children: "Are you sure you want to delete this Artist?" }), _jsx("button", { onClick: () => dispatch(setIsDeleteArtist(false)), children: "Cancel" }), _jsx("button", { className: css `
          background-color: red;
          color: white;
          margin-left: 10px;
          &:hover {
            background-color: darkred;
          }
        `, onClick: () => {
                    handleDelete();
                }, children: "Delete" }), loading && loadding && (_jsx("div", { className: css `
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
          `, children: _jsx(Loading, {}) }))] }));
};
export default DeleteArtist;
//# sourceMappingURL=DeleteArtist.js.map