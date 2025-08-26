import { css } from "@emotion/css";
export const highlightMatch = (text: string, quiry: string) => {
  if (!quiry) {
    return text;
  }

  const lowercaseText = text.toLowerCase();
  const lowercaseQuiry = quiry.toLowerCase();
  const index = lowercaseText.indexOf(lowercaseQuiry);

  if (index == -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + lowercaseQuiry.length);
  const after = text.slice(index + lowercaseQuiry.length);

  return (
    <>
      {before}
      <span
        className={css`
          color: #edc309ff;
          font-weight: bold;
        `}
      >
        {match}
      </span>
      {after}
    </>
  );
};
