import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { css } from "@emotion/css";
import { IoIosAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import SongsInAlbum from "./SongsInAlbum";
import {
  fetchArtistsStart,
  setIsAddArtist,
  setIsDeleteArtist,
  setIsEditArtist,
} from "../store/artist.slice";
import { setIsDeleteModalOpen } from "../store/artist.slice";
import { toast } from "react-toastify";
import Modal from "./Modal";
import AddOrEditArtist from "./AddOrEditArtist";
import DeleteArtist from "./DeleteArtist";
import placeHolder from "../assets/PlaceHolder.png";

const Artists = () => {
  const artists = useSelector((state: any) => state.artist.artists);
  const { loading } = useSelector((state: any) => state.artist);
  const { isDeleteModalOpen, isEditModalOpen } = useSelector(
    (state: any) => state.artist
  );
  interface Artist {
    _id: string;
    name: string;
    genres: string[];
    publicId?: string;
    imageUrl?: string;
    country: string | null;
    albums: Array<{
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
  interface Album {
    _id?: string;
    title: string;
    releaseDate: string;
    coverUrl: string | null;
    tracks: Array<{
      title: string;
      duration: number;
      genre: string;
    }>;
  }
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [artistName, setArtistName] = useState("");
  const dispatch = useDispatch();
  const [loadding, setLoading] = useState(false);
  const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;
  const { isDeleteArtist, isAddArtist, isEditArtist } = useSelector(
    (state: any) => state.artist
  );

  const handleDelete = async () => {
    if (!selectedAlbum?._id) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${serverAddress}/api/deleteAlbum/${selectedAlbum?._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        dispatch(fetchArtistsStart());
        dispatch(setIsDeleteModalOpen(false));
        toast.success("Album deleted successfully");
        setSelectedAlbum(null);
      } else {
        toast.error("Failed to delete the Album");
      }
    } catch (error) {
      console.error("Error deleting Album:", error);
      toast.error("Something went wrong while deleting the Album");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchArtistsStart());
  }, [dispatch, isDeleteModalOpen, isEditModalOpen]);

  return (
    <div>
      <div
        className={css`
          width: 100%;
          display: flex;
          justify-content: end;
          position: sticky;
          top: 0;
          right: 0;
          z-index: 10;
        `}
      >
        <p
          //onClick={() => setIsModalOpen(true)}
          className={css`
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
          `}
          onClick={() => dispatch(setIsAddArtist(true))}
        >
          <IoIosAdd />
          <span>New Artist</span>
        </p>
      </div>
      {!artists.length && !loading && <p>No artists</p>}{" "}
      {(loading || loadding) && <Loading />}
      <div
        className={css`
          width: 100%;
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {!loading &&
          artists.length &&
          !selectedArtist?._id &&
          !selectedAlbum?._id &&
          artists.map((artist: Artist) => (
            <div
              key={artist._id}
              className={css`
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
              `}
              onClick={() => {
                setSelectedArtist(artist);
                setArtistName(artist.name);
              }}
            >
              <img
                src={artist.imageUrl || placeHolder}
                alt="Artist picture"
                className={css`
                  min-width: 130px;
                  max-width: 130px;
                  min-height: 120px;
                  max-height: 120px;
                `}
              />
              <div>
                <p>
                  <span
                    className={css`
                      font-weight: bold;
                    `}
                  >
                    Name:{" "}
                  </span>
                  {artist.name}
                </p>
                <p>
                  <span
                    className={css`
                      font-weight: bold;
                    `}
                  >
                    Albums:{" "}
                  </span>
                  {artist.albums?.length}
                </p>
              </div>
            </div>
          ))}
      </div>
      {/*Show Albums*/}
      {/* Album page Controller*/}
      {selectedArtist && !selectedAlbum && (
        <div
          className={css`
            display: flex;
            align-items: center;
            gap: 10px;
            padding-left: 10px;
          `}
        >
          <button
            onClick={() => setSelectedArtist(null)}
            className={css`
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
            `}
          >
            <IoArrowBack /> Back to Artists
          </button>
          <p
            className={css`
              font-weight: thinner;
              margin: 0;
              &:hover {
                color: red;
                cursor: pointer;
              }
              text-align: right;
            `}
            onClick={() => dispatch(setIsDeleteArtist(true))}
          >
            Delete Artist
          </p>
          <p
            className={css`
              font-weight: thinner;
              margin: 0;
              &:hover {
                color: #446ef8;
                cursor: pointer;
                text-align: right;
              }
            `}
            onClick={() => dispatch(setIsEditArtist(true))}
          >
            Edit Artist
          </p>
        </div>
      )}
      {/*Controller End*/}
      <div
        className={css`
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {!selectedArtist?.albums.length && selectedArtist?._id && (
          <p
            className={css`
              width: 100%;
              text-align: center;
            `}
          >
            No Albums Available
          </p>
        )}
        {!loading &&
          selectedArtist?._id &&
          !selectedAlbum &&
          selectedArtist.albums.map((album: Album) => (
            <div
              key={album._id}
              onClick={() => setSelectedAlbum(album)}
              className={css`
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
              `}
            >
              <div
                className={css`
                  display: flex;
                  flex-direction: column;
                  gap: 2px;
                `}
              >
                <p
                  className={css`
                    margin: 0;
                    text-align: left;
                    font-size: 1.2em;
                  `}
                >
                  <span
                    className={css`
                      font-weight: bold;
                    `}
                  >
                    Title:
                  </span>{" "}
                  {album.title}
                </p>
                <p
                  className={css`
                    margin: 0;
                    text-align: left;
                  `}
                >
                  <span
                    className={css`
                      font-weight: bold;
                    `}
                  >
                    Artist:
                  </span>{" "}
                  {artistName}
                </p>
                <p
                  className={css`
                    margin: 0;
                    text-align: left;
                  `}
                >
                  <span
                    className={css`
                      font-weight: bold;
                    `}
                  >
                    Released:
                  </span>{" "}
                  {album.releaseDate.split("T")[0]}
                </p>
                <p
                  className={css`
                    margin: 0;
                    margin-top: 5px;
                    text-align: right;
                    color: #666;
                    font-size: 0.9em;
                  `}
                >
                  {album.tracks?.length} Tracks
                </p>
              </div>
            </div>
          ))}
        {selectedAlbum?.title && (
          <div
            className={css`
              padding: 10px;
              width: 100%;
              padding-top: 0;
            `}
          >
            <div
              className={css`
                display: flex;
                align-items: center;
                gap: 20px;
              `}
            >
              <button
                onClick={() => setSelectedAlbum(null)}
                className={css`
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
                `}
              >
                <IoArrowBack /> Back to Albums
              </button>
              <p
                className={css`
                  font-weight: thinner;
                  margin: 0;
                  &:hover {
                    color: red;
                    cursor: pointer;
                  }
                  text-align: right;
                `}
                onClick={handleDelete}
              >
                Delete Album
              </p>
            </div>
            <SongsInAlbum mySelectedAlbum={selectedAlbum} />
          </div>
        )}
      </div>
      {/*end*/}
      <p
        className={css`
          position: fixed;
          bottom: 10px;
          right: 50px;
          color: #666;
          font-size: 0.9em;
        `}
      >
        {!selectedArtist && !selectedAlbum //!selectedAlbum?.title
          ? `Total Artist: ${artists.length}`
          : selectedArtist && !selectedAlbum
          ? `Total Album: ${selectedArtist.albums.length}`
          : `Total Songs: ${selectedAlbum?.tracks.length || 0}`}
      </p>
      {/* Delete Modal*/}
      <Modal
        isOpen={isDeleteArtist}
        onClose={() => dispatch(setIsDeleteArtist(false))}
      >
        <DeleteArtist id={selectedArtist?._id!} />
      </Modal>
      {/* End Delete Modal*/}
      {/* Add Modal*/}
      <Modal
        isOpen={isAddArtist}
        onClose={() => dispatch(setIsAddArtist(false))}
      >
        <AddOrEditArtist artist={selectedArtist!} />
      </Modal>
      {/* End Add Modal*/}
      {/* Edit Modal*/}
      <Modal
        isOpen={isEditArtist}
        onClose={() => dispatch(setIsEditArtist(false))}
      >
        <AddOrEditArtist artist={selectedArtist!} />
      </Modal>
      {/* End Edit Modal*/}
    </div>
  );
};

export default Artists;
