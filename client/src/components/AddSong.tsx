import { css } from "@emotion/css";
import { useState } from "react";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setIsAddSongModalOpen } from "../store/artist.slice";

const AddSong = () => {
  const artists = useSelector((state: any) => state.artist.artists);
  const [artistName, setArtistName] = useState<string>("");
  const [newArtist, setNewArtist] = useState("");
  const [albumTitle, setAlbumTitle] = useState("");
  const [newAlbum, setNewAlbum] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");
  const dispatch = useDispatch();
  const formData = new FormData();
  formData.append("file", file as Blob);
  formData.append("artistName", artistName || newArtist);
  formData.append("albumTitle", albumTitle || newAlbum);
  formData.append("title", title);
  formData.append("duration", duration.toString());
  formData.append("genre", genre);
  const submitHandler = async (e: any) => {
    e.preventDefault();
    setUploading(true);
    let albumRes;
    if (newAlbum) {
      albumRes = await fetch(
        "https://mysongs-ylo9.onrender.com/api/createAlbum",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: artistName ? artistName : newArtist,
            title: albumTitle || newAlbum,
            releaseDate,
          }),
        }
      );
      if (!albumRes.ok) {
        toast.error("Failed to Create Song");
        setUploading(false);
        const data = await albumRes.json();
        console.log(data);
        return;
      }
    }
    const res = await fetch(
      "https://mysongs-ylo9.onrender.com/api/createSong",
      {
        method: "POST",
        body: formData,
      }
    );
    const resData = await res.json();
    if (res.ok) {
      toast.success(resData.message);
      dispatch(setIsAddSongModalOpen(false));
    } else {
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

  return (
    <div>
      <div
        className={css`
          @media (max-width: 600px) {
            padding-top: 100px;
          }
        `}
      >
        <h2>Add A New Song</h2>
        <form
          onSubmit={submitHandler}
          className={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            justify-content: center;
            align-items: start;
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
              Song:{" "}
              <span
                className={css`
                  color: red;
                `}
              >
                *
              </span>
            </p>
            <input
              type="file"
              name="song"
              required
              accept=".mp3, .wav, .m4a"
              onChange={(e: any) => {
                setFile(e.target.files[0]);
                setTitle(e.target.files[0].name);

                const objectUrl = URL.createObjectURL(e.target.files[0]);
                const audio = new Audio();
                audio.src = objectUrl;
                audio.addEventListener("loadedmetadata", () => {
                  setDuration(audio.duration);
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
              required={!newArtist}
              onChange={(e) => {
                setArtistName(e.target.value);
                setNewArtist("");
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
              onChange={(e) => {
                setNewArtist(e.target.value);
                setArtistName("");
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
              required={artistName !== "" && !newAlbum}
              onChange={(e) => {
                setAlbumTitle(e.target.value);
                setNewAlbum("");
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
              placeholder="Enter Album Name If not in the list"
              onChange={(e) => {
                setNewAlbum(e.target.value);
                setAlbumTitle("");
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
          {newAlbum && (
            <label>
              <p>
                Release Date <span>*</span>
              </p>
              <input
                type="date"
                required
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </label>
          )}
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
            Add
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

export default AddSong;
