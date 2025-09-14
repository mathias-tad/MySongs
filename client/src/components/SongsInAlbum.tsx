import { css } from "@emotion/css";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  createPlayList,
  setCurrentIndex,
  setIsEditSongModalOpen,
  setIsPlaying,
  setIsDeleteSongModalOpen,
} from "../store/artist.slice";
import { toast } from "react-toastify";
import { fetchArtistsStart } from "../store/artist.slice";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import Loading from "./Loading";
import EditSong from "./EditSong";

interface Album {
  _id?: string;
  title: string;
  releaseDate: string;
  coverUrl: string | null;
  tracks?: Array<{
    _id?: string;
    title: string;
    duration: number;
    genre: string;
  }>;
  artist?: string;
  createdAt?: string;
}

interface Artist {
  _id: string;
  name: string;
  genres: string[];
  country: string | null;
  albums: Array<{
    _id?: string;
    title: string;
    releaseDate: string;
    coverUrl: string | null;
    tracks: Array<{
      title: string;
      duration: number;
      genre: string;
    }>;
  }>;
}

interface Track {
  _id?: string;
  title: string;
  duration: number;
  genre: string;
  artistName: string;
  album: string;
  songUrl?: string;
  publicId?: string;
}

const SongsInAlbum = ({ mySelectedAlbum }: { mySelectedAlbum: Album }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [songId, setSongId] = useState("");
  const { isDeleteSongModalOpen, isEditSongModalOpen, artists } = useSelector(
    (state: any) => state.artist
  );
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedSong, setSelectedSong] = useState<Track | null>(null);
  const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;

  const handleDelete = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`${serverAddress}/api/deleteSong/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        dispatch(fetchArtistsStart());
        dispatch(setIsDeleteSongModalOpen(false));
        toast.success("Song deleted successfully");
      } else {
        toast.error("Failed to delete the song");
      }
    } catch (error) {
      console.error("Error deleting song:", error);
      toast.error("Something went wrong while deleting the song");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedAlbum(mySelectedAlbum);
    if (
      (!isDeleteSongModalOpen || !isDeleteSongModalOpen) &&
      mySelectedAlbum._id
    ) {
      const foundedAlbum = artists
        .flatMap((artist: Artist) => artist.albums)
        .find((album: Album) => album._id == mySelectedAlbum._id);
      setSelectedAlbum(foundedAlbum);
    }
  }, [isDeleteSongModalOpen, isEditSongModalOpen, mySelectedAlbum, artists]);

  if (!selectedAlbum?.tracks?.length) {
    return <div>No tracks available.</div>;
  }
  return (
    <div>
      {selectedAlbum.tracks.map((track, idx) => (
        <div
          key={track._id}
          className={css`
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
          `}
        >
          <div
            className={css`
              max-width: 60%;
                cursor: pointer;
                width: 100%;
              &:hover { background-color: #f0f0f0; }
              padding: 5px;
                border-radius: 5px;
                cursor: pointer;
              }
            `}
            onClick={() => {
              dispatch(setCurrentIndex(idx));
              dispatch(
                createPlayList(
                  selectedAlbum.tracks?.map((t) => ({
                    ...t,
                    artistName: selectedAlbum.artist,
                  })) || []
                )
              );
              dispatch(setIsPlaying(true));
            }}
          >
            <div
              className={css`
                margin: 0;
                font-weight: bold;
                font-size: 16px;
                width: 300px;
                display: flex;
                align-items: center;
                gap: 10px;
              `}
            >
              <p
                className={css`
                  max-width: 200px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                `}
              >
                {track.title}
              </p>{" "}
              -{" "}
              <p
                className={css`
                  margin: 0;
                  font-weight: lighter;
                  text-align: left;
                `}
              >
                {Math.floor(track.duration / 60)}:
                {track.duration % 60 < 10
                  ? "0" + (track.duration % 60)
                  : track.duration % 60}
              </p>
            </div>
            <p
              className={css`
                margin: 0;
                font-weight: lighter;
                text-align: left;
              `}
            >
              <span
                className={css`
                  font-weight: bold;
                  padding-right: 5px;
                  padding-left: 5px;
                `}
              >
                Artist:{" "}
              </span>
              {selectedAlbum.artist}
            </p>
          </div>
          <div
            className={css`
              display: flex;
              align-items: center;
              gap: 10px;
            `}
          >
            <div>
              <p
                className={css`
                  margin: 0;
                  font-weight: lighter;
                  text-align: left;
                `}
              >
                <span
                  className={css`
                    font-weight: bold;
                  `}
                >
                  Genre:{" "}
                </span>{" "}
                {track.genre}
              </p>

              <p
                className={css`
                  margin: 0;
                  font-weight: lighter;
                  text-align: left;
                `}
              >
                <span
                  className={css`
                    font-weight: bold;
                  `}
                >
                  Album:{" "}
                </span>{" "}
                {selectedAlbum.title}
              </p>
            </div>
            <div>
              <MdDelete
                className={css`
                  cursor: pointer;
                  &:hover {
                    color: red;
                  }
                `}
                onClick={() => {
                  setSongId(track._id!);
                  dispatch(setIsDeleteSongModalOpen(true));
                }}
              />
              <MdModeEdit
                className={css`
                  cursor: pointer;
                  &:hover {
                    color: #446ef8;
                  }
                `}
                onClick={() => {
                  setSongId(track._id!);
                  const updatedTrack = {
                    ...track,
                    artistName: mySelectedAlbum.artist!,
                    album: mySelectedAlbum.title,
                  };
                  setSelectedSong(updatedTrack);
                  dispatch(setIsEditSongModalOpen(true));
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <Modal
        isOpen={isDeleteSongModalOpen}
        onClose={() => dispatch(setIsDeleteSongModalOpen(false))}
      >
        <div>
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this song?</p>
          <button onClick={() => dispatch(setIsDeleteSongModalOpen(false))}>
            Cancel
          </button>
          <button
            className={css`
              background-color: red;
              color: white;
              margin-left: 10px;
              &:hover {
                background-color: darkred;
              }
            `}
            onClick={() => {
              handleDelete(songId);
            }}
          >
            Delete
          </button>
          {loading && (
            <div
              className={css`
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
              `}
            >
              <Loading />
            </div>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={isEditSongModalOpen}
        onClose={() => dispatch(setIsEditSongModalOpen(false))}
      >
        <div>
          <EditSong selectedSong={selectedSong} />
          <button
            className={css`
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
            `}
            onClick={() => dispatch(setIsEditSongModalOpen(false))}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SongsInAlbum;
