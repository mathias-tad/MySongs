import { css } from "@emotion/css";

const Loading = () => {
  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        opacity: 0.8;
      `}
    >
      <div
        className={css`
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          border: 10px solid transparent;
          border-top: 10px solid #446ef8;
          animation: spin 1s linear infinite;
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      ></div>
    </div>
  );
};

export default Loading;
