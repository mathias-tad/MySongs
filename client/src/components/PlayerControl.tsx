import { css } from "@emotion/css";
import { CiSearch } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { RxPlay, RxPause } from "react-icons/rx";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { useRef, useEffect } from "react";
import {
  setIsPlaying,
  setCurrentIndex,
  setCurrentTime,
  setSearchString,
} from "../store/artist.slice";

const PlayerControl = () => {
  const { isPlaying, currentIndex, playList } = useSelector(
    (state: any) => state.artist
  );
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  //const { currentTime } = useSelector((state: any) => state.artist);

  const currentSong =
    playList && currentIndex !== undefined ? playList[currentIndex] : null;
  const { currentTime } = useSelector((state: any) => state.artist);

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioRef.current) {
      //audioRef.current.currentTime = currentTime;
      //audioRef.current.src = currentSong?.songUrl || "";
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.currentTime = currentTime;
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const timeUpdateHandler = () => {
      dispatch(setCurrentTime(audio?.currentTime));
    };
    const loadingHandler = () => {
      dispatch(setCurrentTime(0));
    };
    audio?.addEventListener("loadedmetadata", loadingHandler);
    audio?.addEventListener("timeupdate", timeUpdateHandler);
    return () => {
      audio?.removeEventListener("timeupdate", timeUpdateHandler);
      audio?.removeEventListener("loadedmetadata", loadingHandler);
    };
  }, [audioRef, dispatch]);

  const playPauseHandler = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
    } else return;
    dispatch(setIsPlaying(!isPlaying));
  };

  const nextHandler = () => {
    dispatch(setCurrentTime(0));
    const nextIndex = (currentIndex + 1) % (playList ? playList.length : 1);
    dispatch(setCurrentIndex(nextIndex));
    dispatch(setIsPlaying(true));
  };

  const previousHandler = () => {
    dispatch(setCurrentTime(0));
    const prevIndex =
      (currentIndex - 1 + (playList ? playList.length : 1)) %
      (playList ? playList.length : 1);
    dispatch(setCurrentIndex(prevIndex));
    dispatch(setIsPlaying(true));
  };

  const endedHandler = () => {
    setCurrentTime(0);
    const nextIndex = (currentIndex! + 1) % (playList ? playList.length : 1);
    dispatch(setCurrentIndex(nextIndex));
    dispatch(setIsPlaying(true));
  };
  return (
    <>
      <div
        className={css`
          display: flex;
          align-items: center;
          border-radius: 8px;
          background-color: #f0f0f0;
          padding: 5px;
          gap: 10px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          width: fit-content;
        `}
      >
        <audio
          src={currentSong?.songUrl}
          ref={audioRef}
          preload="metadata"
          onEnded={endedHandler}
        ></audio>
        <CiSearch />
        <input
          type="text"
          placeholder="Search for a Song"
          onChange={(e) => dispatch(setSearchString(e.target.value))}
          className={css`
            border: none;
            &:focus {
              outline: none;
            }
            background-color: transparent;
            color: black;
            font-size: 16px;
            padding: 1px;
            width: 200px;
            @media (max-width: 600px) {
              width: 100%;
            }
          `}
        />
      </div>

      {/* Player Controls */}
      <div
        className={css`
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          padding-right: 20px;
        `}
      >
        <div
          className={css`
            display: flex;
            flex-direction: column;
            margin: 0;
            gap: 0;
            padding: 0;
            text-align: left;
          `}
        >
          <p
            className={css`
              margin: 0;
              padding: 5px;
              font-weight: bold;
              width: 400px;
              max-width: 400px;
              overflow: hidden;
              text-overflow: ellipsis;
              max-height: 40px;
              white-space: nowrap;
            `}
          >
            {playList && currentIndex !== undefined && playList.length > 0
              ? playList[currentIndex].title
              : "No song selected"}
          </p>
          <p
            className={css`
              margin: 0;
              font-weight: thinner;
              text-align: left;
              padding: 0 5px 5px 5px;
            `}
          >
            <span
              className={css`
                font-weight: bold;
                padding-right: 5px;
                padding-left: 10px;
              `}
            >
              Artist:{" "}
            </span>
            {playList && currentIndex !== undefined && playList.length > 0
              ? playList[currentIndex].artistName
              : "Unknown Artist"}
          </p>
        </div>
        <div
          className={css`
            font-size: 20px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 20px;
            margin: 0;
            padding-top: 0;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            background-color: #f0f0f0;
            padding: 5px 10px;
          `}
        >
          <div
            className={css`
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
            `}
          >
            {!isPlaying && (
              <RxPlay
                onClick={() => {
                  if (!playList || playList.length === 0) return;
                  dispatch(setIsPlaying(true));
                  playPauseHandler;
                }}
                className={css`
                  cursor: pointer;
                  border-radius: 50%;
                  padding: 3px;
                  &:hover {
                    background-color: #dbdbdbff;
                  }
                `}
              />
            )}
            {isPlaying && (
              <RxPause
                onClick={() => {
                  dispatch(setIsPlaying(false));
                  playPauseHandler;
                }}
                className={css`
                  cursor: pointer;
                  border-radius: 50%;
                  padding: 3px;
                  &:hover {
                    background-color: #dbdbdbff;
                  }
                `}
              />
            )}
            <MdSkipPrevious
              onClick={previousHandler}
              className={css`
                cursor: pointer;
                border-radius: 50%;
                padding: 3px;
                &:hover {
                  background-color: #dbdbdbff;
                }
              `}
            />
            <MdSkipNext
              onClick={nextHandler}
              className={css`
                cursor: pointer;
                border-radius: 50%;
                padding: 3px;
                &:hover {
                  background-color: #dbdbdbff;
                }
              `}
            />
            <p
              className={css`
                text-size: 10px;
                margin: 0;
                padding: 3px;
                padding-left: 10px;
                font-weight: lighter;
              `}
            >
              {Math.floor(currentTime / 60)}:
              {Math.floor(currentTime % 60) < 10 ? "0" : ""}
              {Math.floor(currentTime % 60)}/
              {currentSong
                ? currentSong.duration.toString().split(".")[0]
                : "0:00"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerControl;
