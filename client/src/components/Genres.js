import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const artists = useSelector((state) => state.artist.artists);
    const [count, setCount] = useState(() => {
        const initial = {};
        genres.forEach((g) => {
            initial[g] = 0;
        });
        return initial;
    });
    useEffect(() => {
        if (!artists)
            return;
        const genreCounts = { ...count };
        genres.forEach((g) => {
            genreCounts[g] = 0;
        });
        artists?.forEach((artist) => {
            artist.albums?.forEach((album) => {
                album.tracks?.forEach((track) => {
                    const genre = track.genre;
                    if (genres.includes(genre))
                        genreCounts[genre] += 1;
                });
            });
        });
        setCount(genreCounts);
    }, []);
    return (_jsx("div", { className: css `
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
      `, children: genres.map((genre, idx) => (_jsxs("div", { className: css `
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
          `, children: [_jsx("p", { className: css `
              font-weight: bold;
              font-size: 1.2em;
              margin-bottom: 5px;
              color: #333;
            `, children: genre }), _jsxs("p", { children: [count[genre], " Songs"] })] }, idx))) }));
};
export default Genres;
//# sourceMappingURL=Genres.js.map