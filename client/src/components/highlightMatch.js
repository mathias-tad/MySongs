import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from "@emotion/css";
export const highlightMatch = (text, quiry) => {
    if (!quiry) {
        return text;
    }
    const lowercaseText = text.toLowerCase();
    const lowercaseQuiry = quiry.toLowerCase();
    const index = lowercaseText.indexOf(lowercaseQuiry);
    if (index == -1)
        return text;
    const before = text.slice(0, index);
    const match = text.slice(index, index + lowercaseQuiry.length);
    const after = text.slice(index + lowercaseQuiry.length);
    return (_jsxs(_Fragment, { children: [before, _jsx("span", { className: css `
          color: #edc309ff;
          font-weight: bold;
        `, children: match }), after] }));
};
//# sourceMappingURL=highlightMatch.js.map