import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchArtistsStart, setIsAddArtist, setIsEditArtist, } from "../store/artist.slice";
const AddOrEditArtist = ({ artist }) => {
    const { isEditArtist } = useSelector((state) => state.artist);
    const [previewData, setPreviewData] = useState(null);
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const formData = new FormData();
    formData.append("file", image);
    formData.append("name", name);
    const dispatch = useDispatch();
    const submitHandler = async (e) => {
        e.preventDefault();
        if (isEditArtist) {
            if (!artist._id) {
                toast.error("No Artist selected");
            }
            try {
                const res = await fetch(`http://localhost:1316/api/updateArtist/${artist._id}`, {
                    method: "PUT",
                    body: formData,
                });
                const data = await res.json();
                if (res.ok) {
                    dispatch(fetchArtistsStart());
                    toast.success("Artist updated");
                    dispatch(setIsAddArtist(false));
                    dispatch(setIsEditArtist(false));
                }
                else {
                    toast.error(data.error);
                }
            }
            catch (error) {
                toast.error("Server error: Unable to update artist");
            }
        }
        else {
            try {
                const res = await fetch(`http://localhost:1316/api/createArtist`, {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                if (res.ok) {
                    dispatch(fetchArtistsStart());
                    toast.success("Artist created");
                    dispatch(setIsAddArtist(false));
                    dispatch(setIsEditArtist(false));
                }
                else {
                    toast.error(data.error);
                }
            }
            catch (error) {
                toast.error("Server error: Unable to update artist");
            }
        }
    };
    useEffect(() => {
        if (isEditArtist) {
            setName(artist.name);
        }
    }, [isEditArtist]);
    return (_jsxs("div", { children: [_jsx("h2", { children: isEditArtist ? "Edit Artist" : "Add a New Artist" }), _jsxs("form", { className: css `
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
          justify-content: center;
          align-items: center;
        `, onSubmit: submitHandler, children: [_jsxs("label", { children: [_jsx("p", { children: "Artist Picture: " }), (previewData || artist?.imageUrl) && (_jsx("img", { src: artist?.imageUrl || previewData || undefined, alt: "Preview", className: css `
                max-width: 200px;
              ` })), _jsx("input", { type: "file", accept: "image/*", className: css `
              display: block;
              self-align: center;
              margin-left: 0;
              margin-bottom: 5px;
              text-align: left;
              font-weight: bold;
            `, onChange: (e) => {
                                    const files = e.target.files;
                                    let file;
                                    if (files)
                                        file = files[0];
                                    setImage(file || null);
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            if (typeof reader.result === "string")
                                                setPreviewData(reader.result);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                } })] }), _jsxs("label", { children: [_jsxs("p", { className: css `
              self-align: start;
              margin-left: 0;
              margin-bottom: 5px;
              text-align: left;
              font-weight: bold;
            `, children: [_jsxs("span", { className: css `
                font-weight: bold;
              `, children: ["Artist name:", " "] }), _jsx("span", { className: css `
                color: red;
              `, children: "*" })] }), _jsx("input", { type: "text", required: true, name: "name", onChange: (e) => setName(e.target.value), value: name, className: css `
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
          `, children: isEditArtist ? "Save" : "Create" })] })] }));
};
export default AddOrEditArtist;
//# sourceMappingURL=AddOrEditArtist.js.map