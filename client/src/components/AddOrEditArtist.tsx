import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchArtistsStart,
  setIsAddArtist,
  setIsEditArtist,
} from "../store/artist.slice";

type Artist = {
  _id?: string;
  name: string;
  imageUrl?: string;
};
interface ArtistProp {
  artist: Artist;
}

const AddOrEditArtist: React.FC<ArtistProp> = ({ artist }) => {
  const { isEditArtist } = useSelector((state: any) => state.artist);
  const [previewData, setPreviewData] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const formData = new FormData();
  formData.append("file", image as Blob);
  formData.append("name", name);
  const dispatch = useDispatch();
  const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (isEditArtist) {
      if (!artist._id) {
        toast.error("No Artist selected");
      }
      try {
        const res = await fetch(
          `${serverAddress}/api/updateArtist/${artist._id}`,
          {
            method: "PUT",
            body: formData,
          }
        );
        const data = await res.json();
        if (res.ok) {
          dispatch(fetchArtistsStart());
          toast.success("Artist updated");
          dispatch(setIsAddArtist(false));
          dispatch(setIsEditArtist(false));
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error("Server error: Unable to update artist");
      }
    } else {
      try {
        const res = await fetch(`${serverAddress}/api/createArtist`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          dispatch(fetchArtistsStart());
          toast.success("Artist created");
          dispatch(setIsAddArtist(false));
          dispatch(setIsEditArtist(false));
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error("Server error: Unable to update artist");
      }
    }
  };

  useEffect(() => {
    if (isEditArtist) {
      setName(artist.name);
    }
  }, [isEditArtist]);

  return (
    <div>
      <h2>{isEditArtist ? "Edit Artist" : "Add a New Artist"}</h2>
      <form
        className={css`
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
          justify-content: center;
          align-items: center;
        `}
        onSubmit={submitHandler}
      >
        <label>
          <p>Artist Picture: </p>
          {(previewData || artist?.imageUrl) && (
            <img
              src={artist?.imageUrl || previewData || undefined}
              alt="Preview"
              className={css`
                max-width: 200px;
              `}
            />
          )}
          <input
            type="file"
            accept="image/*"
            className={css`
              display: block;
              self-align: center;
              margin-left: 0;
              margin-bottom: 5px;
              text-align: left;
              font-weight: bold;
            `}
            onChange={(e) => {
              const files = e.target.files;
              let file;
              if (files) file = files[0];
              setImage(file || null);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (typeof reader.result === "string")
                    setPreviewData(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </label>
        <label>
          <p
            className={css`
              self-align: start;
              margin-left: 0;
              margin-bottom: 5px;
              text-align: left;
              font-weight: bold;
            `}
          >
            <span
              className={css`
                font-weight: bold;
              `}
            >
              Artist name:{" "}
            </span>
            <span
              className={css`
                color: red;
              `}
            >
              *
            </span>
          </p>
          <input
            type="text"
            required
            name="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className={css`
              display: block;
              width: 100%;
              padding: 8px;
              border-radius: 4px;
              border: 1px solid #ccc;
              margin-left: 0;
              outline: none;
            `}
          />
        </label>
        <button
          type="submit"
          className={css`
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
          `}
        >
          {isEditArtist ? "Save" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default AddOrEditArtist;
