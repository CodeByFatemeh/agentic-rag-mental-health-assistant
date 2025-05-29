import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './TypingIndicator.scss';
export const TypingIndicator = ({ isTyping }) => {
    return (isTyping && (_jsxs("div", { className: "typing-indicator", children: [_jsx("div", { className: "dot" }), _jsx("div", { className: "dot" }), _jsx("div", { className: "dot" })] })));
};
