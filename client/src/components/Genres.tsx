import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const Genres = () => {
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

  const artists = useSelector((state: any) => state.artist.artists);
  const [count, setCount] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    genres.forEach((g) => {
      initial[g] = 0;
    });
    return initial;
  });
  useEffect(() => {
    if (!artists) return;
    const genreCounts: Record<string, number> = { ...count };
    genres.forEach((g) => {
      genreCounts[g] = 0;
    });
    artists?.forEach((artist: any) => {
      artist.albums?.forEach((album: any) => {
        album.tracks?.forEach((track: any) => {
          const genre = track.genre;
          if (genres.includes(genre)) genreCounts[genre] += 1;
        });
      });
    });
    setCount(genreCounts);
  }, []);
  return (
    <div
      className={css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
      `}
    >
      {genres.map((genre, idx) => (
        <div
          key={idx}
          className={css`
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin: 10px;
            width: 200px;
            padding: 10px;
            cursor: pointer;
            &:hover {
              transform: scale(1.01);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              transition: transform 0.2s, box-shadow 0.2s;
            }
          `}
        >
          <p
            className={css`
              font-weight: bold;
              font-size: 1.2em;
              margin-bottom: 5px;
              color: #333;
            `}
          >
            {genre}
          </p>
          <p>{count[genre]} Songs</p>
        </div>
      ))}
    </div>
  );
};

export default Genres;
