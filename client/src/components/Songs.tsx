import { MdModeEdit, MdDelete } from "react-icons/md";
import { css } from "@emotion/css";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPlayList,
  setIsPlaying,
  setCurrentIndex,
  setSelectedGenre,
} from "../store/artist.slice";
import { toast } from "react-toastify";
import { fetchArtistsStart } from "../store/artist.slice";
import Loading from "./Loading";
import EditSong from "./EditSong";
import { highlightMatch } from "./highlightMatch";

type Song = {
  _id: string;
  title: string;
  duration: number;
  genre: string;
  artistName: string;
  album: string;
  songUrl?: string;
  publicId?: string;
};
type SongsProps = {
  songs: Song[];
};

const Songs: React.FC<SongsProps> = ({ songs }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [songId, setSongId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [songToEdit, setSongToEdit] = useState<Song | null>(null);
  const [filteredSong, setFilteredSong] = useState<Song[] | null>(null);
  const { selectedGenre, searchString } = useSelector(
    (state: any) => state.artist
  );
  useEffect(() => {
    if (!searchString) {
      setFilteredSong(
        selectedGenre
          ? songs?.filter((song: any) => song.genre == selectedGenre)
          : songs
      );
    } else {
      dispatch(setSelectedGenre(""));
      setFilteredSong(
        songs?.filter((song: any) => {
          const searchTerm = searchString.toLowerCase();
          return (
            song.title?.toLowerCase().includes(searchTerm) ||
            song.artistName?.toLowerCase().includes(searchTerm) ||
            song.album?.toLowerCase().includes(searchTerm) ||
            song.genre?.toLowerCase().includes(searchTerm)
          );
        })
      );
    }
  }, [songs, selectedGenre, searchString]);

  const handleDelete = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://mysongs-ylo9.onrender.com/api/deleteSong/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        dispatch(fetchArtistsStart());
        setIsDeleteModalOpen(false);
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

  return (
    <div>
      {filteredSong?.length === 0 && <div>No Songs Available</div>}
      {filteredSong &&
        filteredSong?.map((song: Song, index) => (
          <div
            key={song._id}
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
                dispatch(createPlayList(songs));
                dispatch(setIsPlaying(true));
                dispatch(setCurrentIndex(index));
              }}
            >
              <p
                className={css`
                  font-weight: bold;
                  font-size: 20px;
                  margin-bottom: 5px;
                  max-width: 400px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                `}
              >
                {highlightMatch(song.title, searchString)}
              </p>

              <p
                className={css`
                  margin-top: 5px;
                  margin-left: 10px;
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
                {highlightMatch(song.artistName, searchString)}
              </p>
            </div>
            <div
              className={css`
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
              `}
            >
              <p>
                <span
                  className={css`
                    font-weight: bold;
                    margin-bottom: 0;
                    margin-top: 0;
                    padding-top: 0;
                    padding-bottom: 0;
                  `}
                >
                  Album:{" "}
                </span>{" "}
                <span>{highlightMatch(song.album, searchString)}</span>
              </p>
              <p>
                <span
                  className={css`
                    font-weight: bold;
                    margin-top: 0;
                    margin-bottom: 0;
                    padding-top: 0;
                    padding-bottom: 0;
                  `}
                >
                  Genre:{" "}
                </span>{" "}
                {highlightMatch(song.genre, searchString)}
              </p>
              <p>{song.duration}</p>
              <MdDelete
                className={css`
                  cursor: pointer;
                  &:hover {
                    color: red;
                  }
                `}
                onClick={() => {
                  setIsDeleteModalOpen(true);
                  setSongId(song._id);
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
                  setIsEditModalOpen(true);
                  setSongToEdit(song);
                }}
              />
            </div>
          </div>
        ))}
      <p
        className={css`
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
        `}
      >
        {filteredSong?.length} Total Tracks
      </p>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div>
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this song?</p>
          <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
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
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div>
          <EditSong selectedSong={songToEdit} />
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
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Songs;
