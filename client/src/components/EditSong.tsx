import { css } from "@emotion/css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { fetchArtistsStart } from "../store/artist.slice";

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

const EditSong: React.FC<SongsProps> = ({ selectedSong }) => {
  const artists = useSelector((state: any) => state.artist.artists);
  const [artistName, setArtistName] = useState("");
  const [newArtistName, setNewArtistName] = useState("");
  const [albumTitle, setAlbumTitle] = useState("");
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;
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
  formData.append("file", file as Blob);
  formData.append("artistName", artistName || newArtistName);
  formData.append("albumTitle", albumTitle || newAlbumTitle);
  formData.append("title", title);
  formData.append("genre", genre);
  const dispatch = useDispatch();
  const submitHandler = async (e: any) => {
    e.preventDefault();
    setUploading(true);
    if (file) {
      formData.append("duration", duration.toString());
    }
    try {
      const res = await fetch(
        `${serverAddress}/api/updateSong/${selectedSong?._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const resData = await res.json();
      if (res.ok) {
        toast.success(resData.message);
      } else {
        toast.error(resData.error || "Failed to save changes");
      }
      setArtistName("");
      setAlbumTitle("");
      setTitle("");
      setDuration(0);
      setGenre("");
      setFile(null);
      dispatch(fetchArtistsStart());
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server Error: Unable to update song");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        className={css`
          @media (max-width: 600px) {
            padding-top: 100px;
          }
        `}
      >
        <h2>Update Song Detail</h2>
        <form
          onSubmit={submitHandler}
          className={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            padding-bottom: 0;
            justify-content: center;
            align-items: start;
            margin-bottom: -20px;
          `}
        >
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
              Current Song:
            </p>
            <audio controls>
              <source src={selectedSong?.songUrl} type="audio/mpeg" />
            </audio>
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
              New Song:{" "}
            </p>
            <input
              type="file"
              name="song"
              accept=".mp3, .wav, .m4a"
              onChange={(e: any) => {
                setFile(e.target.files[0]);
                setTitle(e.target.files[0].name);
                if (!e.target.files[0]) return;

                const objectUrl = URL.createObjectURL(e.target.files[0]);
                const audio = new Audio();
                audio.src = objectUrl;
                audio.addEventListener("loadedmetadata", () => {
                  if (e.target.files[0]) {
                    setDuration(audio.duration);
                  }
                  URL.revokeObjectURL(e.target.value);
                });
              }}
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
            <p
              className={css`
                font-weight: lighter;
                font-size: 12px;
                color: #666;
                margin-top: 5px;
              `}
            >
              ⚠️ Make sure the audio format is among mp3, wav and m4a
            </p>
          </label>
          <label>
            <p
              className={css`
                self-align: start;
                margin-left: 0;
                text-align: left;
                font-weight: bold;
                margin-bottom: 5px;
              `}
            >
              Song Name:{" "}
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
              name="songName"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              //onChange={(e) => setTitle(e.target.value)}
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
          <label>
            <p
              className={css`
                text-align: left;
                font-weight: bold;
                margin-bottom: 5px;
              `}
            >
              Artist:{" "}
              <span
                className={css`
                  color: red;
                `}
              >
                *
              </span>
            </p>
            <select
              name="artist"
              id=""
              value={artistName}
              required={!newArtistName}
              onChange={(e) => {
                setArtistName(e.target.value);
                setNewArtistName("");
              }}
              className={css`
                display: block;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 0;
                margin-bottom: 5px;
                outline: none;
              `}
            >
              <option value="">Select Artist</option>
              {/* Map through artists and create options */}
              {artists.map((artist: any) => (
                <option key={artist._id} value={artist.name}>
                  {artist.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="artist"
              placeholder="Artist Name If not in the list"
              required={!artistName}
              value={newArtistName}
              onChange={(e) => {
                setArtistName("");
                setNewArtistName(e.target.value);
              }}
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
          <label>
            <p
              className={css`
                self-align: start;
                margin-left: 0;
                text-align: left;
                font-weight: bold;
                margin-bottom: 5px;
              `}
            >
              Album Name:{" "}
              <span
                className={css`
                  color: red;
                `}
              >
                *
              </span>
            </p>
            <select
              name="albumName"
              id=""
              disabled={!artistName}
              required={!newAlbumTitle}
              onChange={(e) => {
                setAlbumTitle(e.target.value);
                setNewAlbumTitle("");
              }}
              value={albumTitle}
              className={css`
                display: block;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 0;
                margin-bottom: 5px;
                outline: none;
              `}
            >
              <option value="">Select Album</option>
              {/* Map through albums and create options */}
              {artists.map(
                (artist: any) =>
                  artist.name == artistName &&
                  artist.albums.map((album: any) => (
                    <option key={album._id} value={album.title}>
                      {album.title}
                    </option>
                  ))
              )}
            </select>
            <input
              type="text"
              name="albumName"
              required={!albumTitle}
              value={newAlbumTitle}
              placeholder="Enter Album Name If not in the list"
              onChange={(e) => {
                setAlbumTitle("");
                setNewAlbumTitle(e.target.value);
              }}
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
          <label>
            <p
              className={css`
                text-align: left;
                font-weight: bold;
                margin-bottom: 5px;
              `}
            >
              Genre:{" "}
              <span
                className={css`
                  color: red;
                `}
              >
                *
              </span>
            </p>
            <select
              name="genre"
              required
              //onChange={(e) => setReleaseDate(e.target.value)}
              onChange={(e) => setGenre(e.target.value)}
              value={genre}
              className={css`
                display: block;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 0;
                outline: none;
              `}
            >
              <option value="">Select Genre</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Hip-Hop">Hip-Hop</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
              <option value="Country">Country</option>
              <option value="Electronic">Electronic</option>
              <option value="Reggae">Reggae</option>
              <option value="Blues">Blues</option>
              <option value="Folk">Folk</option>
              <option value="R&B">R&B</option>
            </select>
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
            Save
          </button>
        </form>
      </div>
      {uploading && (
        <div
          className={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <Loading />
        </div>
      )}
    </div>
  );
};

export default EditSong;
