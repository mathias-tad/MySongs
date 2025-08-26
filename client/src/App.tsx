import { useEffect, useState } from "react";
import "./App.css";
import { css } from "@emotion/css";
import { MdClose, MdLibraryMusic } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { GiMusicalNotes } from "react-icons/gi";
import { RiUserVoiceLine } from "react-icons/ri";
import Albums from "./components/Albums";
import Artists from "./components/Artists";
import Modal from "./components/Modal";
import Genres from "./components/Genres";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtistsStart, setSelectedGenre } from "./store/artist.slice";
import AddSong from "./components/AddSong";
import Songs from "./components/Songs";
import PlayerControl from "./components/PlayerControl";
import Loading from "./components/Loading";
import { setIsAddSongModalOpen } from "./store/artist.slice";
import { IoMdList } from "react-icons/io";

function App() {
  const [activeLink, setActiveLink] = useState("Home");
  const { isAddSongModalOpen } = useSelector((state: any) => state.artist);
  const dispatch = useDispatch();
  const { artists, loading, searchString, selectedGenre } = useSelector(
    (state: any) => state.artist
  );
  const genres = [
    "Rock",
    "Pop",
    "Jazz",
    "Classical",
    "Hip-Hop",
    "Country",
    "Electronic",
    "Reggae",
    "Blues",
    "Folk",
    "R&B",
  ];
  //console.log(artists);
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
  const [songs, setSongs] = useState<Song[]>([]);
  const [hidden, setHidden] = useState(true);
  //console.log(songs);
  useEffect(() => {
    dispatch(fetchArtistsStart());
    //toast.success("Artists Data Fetched Successfully");
    // if (error) {
    //   toast.error("Server Error: Unable to fetch artists data");
    // }
  }, [dispatch, isAddSongModalOpen]);
  useEffect(() => {
    setActiveLink("Home");
  }, [searchString]);
  useEffect(() => {
    setSongs([]);
    artists.map((artist: any) => {
      artist.albums.map((album: any) => {
        album.tracks.map((track: any) => {
          const updatedTrack = {
            ...track,
            artistName: artist.name,
            album: album.title,
            duration: `${Math.floor(track.duration / 60)}:${
              track.duration % 60 < 10
                ? "0" + (track.duration % 60)
                : track.duration % 60
            }`,
            _id: track._id,
          };
          setSongs((prevSongs) => [...prevSongs, updatedTrack]);
        });
      });
    });
  }, [artists]);
  return (
    <div
      className={css`
        display: flex;
        height: 100vh;
        background-color: #e4e7ec;
        color: black;
        padding-left: 2px;
        padding-right: 2px;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        gap: 0px;
        text-align: center;
        margin: 0;
        border-radius: 8px;
        font-family: "Open Sans", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
        font-variation-settings: "wdth" 100;
        @media (max-width: 600px) {
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }
        @media (min-width: 601px) and (max-width: 1200px) {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
          padding-bottom: 30px;
        }
        @media (min-width: 1201px) {
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          padding-bottom: 30px;
        }
      `}
    >
      <div
        className={css`
          width: 200px;
          background-color: #151821;
          color: rgba(234, 232, 232, 1);
          padding-left: 20px;
          padding-right: 20px;
          height: 100%;
          overflow-y: auto;
          margin: 0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          &:hover {
            background-color: rgba(34, 34, 34, 1);
            color: rgba(234, 232, 232, 1);
          }
          transition: background-color 0.3s ease, color 0.3s ease;
          @media (max-width: 600px) {
            height: auto;
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 40;
          }
        `}
      >
        <h1
          className={css`
            color: rgba(234, 232, 232, 1);
            font-weight: bold;
            text-align: center;
            margin-bottom: 40px;
            font-family: "Edu NSW ACT Cursive", cursive;
            font-optical-sizing: auto;
            font-style: normal;
          `}
        >
          My Songs
        </h1>
        {hidden && (
          <IoMdList
            className={css`
              display: none;
              @media (max-width: 600px) {
                display: block;
                position: fixed;
                top: 90px;
                left: 5px;
              }
            `}
            onClick={() => setHidden(!hidden)}
          />
        )}
        {!hidden && (
          <MdClose
            className={css`
              display: none;
              @media (max-width: 600px) {
                display: block;
                position: fixed;
                top: 90px;
                left: 5px;
              }
            `}
            onClick={() => setHidden(!hidden)}
          />
        )}
        <div
          className={css`
            @media (max-width: 600px) {
              display: ${hidden ? "none" : "block"};
            }
          `}
        >
          <p
            onClick={() => setActiveLink("Home")}
            className={css`
            ${
              activeLink == "Home" ? "background-color: #446ef8;" : ""
            } cursor: pointer;
             padding: 5px;
              border-radius: 6px;
              font-weight: bold;
              display: flex;
              align-items: center;
              gap: 10px;
              &:hover {
                background-color: #6487fdff;
                color: rgba(234, 232, 232, 1);
          `}
          >
            <IoHomeOutline />
            <span>Home</span>
          </p>
          <p
            onClick={() => setActiveLink("Albums")}
            className={css`
            ${
              activeLink == "Albums" ? "background-color: #446ef8;" : ""
            } cursor: pointer;
             padding: 5px;
              border-radius: 6px;
              font-weight: bold;
              display: flex;
              align-items: center;
              gap: 10px;
              color: rgba(234, 232, 232, 1);
              font-size: 16px;
              &:hover {
                background-color: #6487fdff;
                color: rgba(234, 232, 232, 1);
          `}
          >
            <MdLibraryMusic />
            <span>Albums</span>
          </p>
          <p
            onClick={() => setActiveLink("Artists")}
            className={css`
            ${
              activeLink == "Artists" ? "background-color: #446ef8;" : ""
            } cursor: pointer;
             padding: 5px;
              border-radius: 6px;
              font-weight: bold;
              display: flex;
              align-items: center;
              gap: 10px;
              &:hover {
                background-color: #6487fdff;
                color: rgba(234, 232, 232, 1);
          `}
          >
            <RiUserVoiceLine />
            <span>Artists</span>
          </p>
          <p
            onClick={() => setActiveLink("Genres")}
            className={css`
            ${
              activeLink == "Genres" ? "background-color: #446ef8;" : ""
            } cursor: pointer;
             padding: 5px;
              border-radius: 6px;
              font-weight: bold;
              display: flex;
              align-items: center;
              gap: 10px;
              &:hover {
                background-color: #6487fdff;
                color: rgba(234, 232, 232, 1);
          `}
          >
            <GiMusicalNotes />
            <span>Genres</span>
          </p>
        </div>
      </div>
      <div
        className={css`
          flex: 1;
          background-color: #e4e7ec;
          border-radius: 8px;
          height: 100%;
          @media (max-width: 600px) {
            width: 100%;
          }
          @media (min-width: 601px) and (max-width: 1200px) {
            width: 80%;
        `}
      >
        <div
          className={css`
            padding: 10px;
            background-color: #fefefe;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-radius: 0 8px 8px 0;
            height: 80px;
            @media (max-width: 600px) {
              height: 120px;
              margin-top: 100px;
            }
            @media (min-width: 601px) and (max-width: 800px) {
              height: 120px;
            }
          `}
        >
          <PlayerControl />
        </div>
        {/* Main Navigated Pages Display Area */}
        <div
          className={css`
            overflow-y: auto;
            height: calc(100% - 120px);
            box-sizing: border-box;
            background-color: #fefefe;
            color: black;
            margin-top: 20px;
            border-radius: 0 8px 8px 0;
            padding-right: 20px;
            @media (max-width: 600px) {
              height: calc(100% - 180px);
              padding-bottom: 130px;
            }
            @media (min-width: 601px) and (max-width: 800px) {
              height: calc(100% - 160px);
            }
          `}
        >
          {activeLink === "Home" && (
            <div>
              <div
                className={css`
                  width: 100%;
                  position: sticky;
                  top: 0;
                  display: flex;
                  justify-content: space-between;
                  background-color: #fff;
                  opacity: 0.95;
                  z-index: 20;
                `}
              >
                <select
                  onChange={(e) => dispatch(setSelectedGenre(e.target.value))}
                  value={selectedGenre}
                  className={css`
                    position: sticky;
                    top: 0;
                    left: 10px;
                    z-index: 20;
                    background-color: #e6e4e4ff;
                    padding-right: 10px;
                    padding-left: 10px;
                    margin-top: 15px;
                    margin-bottom: 15px;
                    min-width: 100px;
                    color: #000;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    width: fit-content;
                    &:hover {
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                      transition: box-shadow 0.2s;
                    }
                    @media (max-width: 600px) {
                      top: 150px;
                    }
                    &:focus {
                      outline: none;
                    }
                  `}
                >
                  <option
                    value=""
                    disabled
                    className={css`
                      color: #000;
                      background-color: #fff;
                    `}
                  >
                    Filter by Genre
                  </option>
                  <option
                    value=""
                    className={css`
                      color: #000;
                      background-color: #fff;
                    `}
                  >
                    All
                  </option>
                  {genres.map((genre, idx) => {
                    return (
                      <option key={idx} value={genre}>
                        {genre}
                      </option>
                    );
                  })}
                </select>
                <p
                  onClick={() => dispatch(setIsAddSongModalOpen(true))}
                  className={css`
                    position: sticky;
                    top: 0;
                    right: 0;
                    text-align: right;
                    z-index: 20;
                    background-color: #446ef8;
                    padding: 5px;
                    padding-right: 10px;
                    padding-left: 10px;
                    color: #fff;
                    border-radius: 5px;
                    cursor: pointer;
                    width: fit-content;
                    &:hover {
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                      transition: box-shadow 0.2s;
                    }
                    @media (max-width: 600px) {
                      top: 150px;
                    }
                  `}
                >
                  Add a Song
                </p>
              </div>
              {loading && <Loading />}
              {!loading && <Songs songs={songs} />}
            </div>
          )}
          {activeLink === "Albums" && <Albums />}
          {activeLink === "Artists" && <Artists />}
          {activeLink === "Genres" && <Genres />}
        </div>
      </div>
      <Modal
        isOpen={isAddSongModalOpen}
        onClose={() => dispatch(setIsAddSongModalOpen(false))}
      >
        <AddSong />
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        draggable
        closeOnClick
      />
    </div>
  );
}

export default App;
