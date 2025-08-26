import Loading from "./Loading";
import { fetchArtistsStart, setIsDeleteArtist } from "../store/artist.slice";
import { useDispatch, useSelector } from "react-redux";
import { css } from "@emotion/css";
import { toast } from "react-toastify";
import { useState } from "react";

interface IdProp {
  id: string;
}

const DeleteArtist = ({ id }: IdProp) => {
  const dispatch = useDispatch();
  const [loadding, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://mysongs-ylo9.onrender.com/api/deleteArtist/${id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        toast.success("Artist Deleted");
        dispatch(fetchArtistsStart());
        dispatch(setIsDeleteArtist(false));
      } else {
        const data = await res.json();
        toast.error(data?.error);
      }
    } catch (error) {
      toast.error("Server Error Unable to delete artist");
    } finally {
      setLoading(false);
    }
  };
  const { loading } = useSelector((state: any) => state.artist);
  return (
    <div>
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this Artist?</p>
      <button onClick={() => dispatch(setIsDeleteArtist(false))}>Cancel</button>
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
          handleDelete();
        }}
      >
        Delete
      </button>
      {loading && loadding && (
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
  );
};

export default DeleteArtist;
