import { css } from "@emotion/css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
        z-index: 20;
        padding-top: 100px;
      `}
      onClick={onClose}
    >
      <div
        className={css`
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          max-width: 500px;
          width: 100%;
          overflow-y: auto;
          max-height: 100%;
          margin-bottom: 200px;
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
