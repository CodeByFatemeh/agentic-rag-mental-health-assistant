import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Avatar, Typography, IconButton, useTheme } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckIcon from '@mui/icons-material/Check';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import OpenAIIcon from '../../../public/img/chatbot.webp'
function extractCodeFromString(message) {
    if (message.includes('```')) {
        return message.split('```');
    }
    return undefined;
}
function isCodeBlock(str) {
    return (str.includes('=') ||
        str.includes(';') ||
        str.includes('[') ||
        str.includes(']') ||
        str.includes('{') ||
        str.includes('}') ||
        str.includes('#') ||
        str.includes('//'));
}
const ChatItem = ({ content, role, id }) => {
    var _a, _b, _c;
    const [copied, setCopied] = useState(false);
    const messageBlocks = extractCodeFromString(content);
    const auth = useAuth();
    const theme = useTheme();
    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };
    const renderContent = () => {
        if (!messageBlocks) {
            const bulletRegex = /^[-*\u2022]\s+(.+)$/; // Regex for -, *, and •
            const numberedRegex = /^\d+\.\s+(.+)$/; // Regex for numbered lists
            return (_jsx(Typography, { sx: { fontSize: '20px' }, children: content.split('\n').map((line, index) => {
                    const bulletMatch = bulletRegex.exec(line);
                    const numberedMatch = numberedRegex.exec(line);
                    if (bulletMatch) {
                        return (_jsxs("span", { children: ["\u2022 ", bulletMatch[1], _jsx("br", {})] }, `${id}-${index}`));
                    }
                    else if (numberedMatch) {
                        return (_jsxs("span", { children: [index + 1, ". ", numberedMatch[1], _jsx("br", {})] }, `${id}-${index}`));
                    }
                    else {
                        return (_jsxs("span", { children: [line, _jsx("br", {})] }, `${id}-${index}`));
                    }
                }) }));
        }
        return messageBlocks.map((block, index) => {
            if (isCodeBlock(block)) {
                const language = block.split('\n')[0].trim();
                const code = block.substring(language.length).trim();
                return (_jsxs(Box, { sx: { position: 'relative' }, children: [_jsx(SyntaxHighlighter, { style: coldarkDark, language: language || 'javascript', children: code }), _jsx(IconButton, { onClick: () => handleCopyCode(code), sx: { position: 'absolute', top: 0, right: 0, color: 'white' }, children: copied ? _jsx(CheckIcon, {}) : _jsx(FileCopyIcon, {}) })] }, `${id}-${index}`));
            }
            else {
                const bulletRegex = /^[-*\u2022]\s+(.+)$/; // Regex for -, *, and •
                const numberedRegex = /^\d+\.\s+(.+)$/; // Regex for numbered lists
                return (_jsx(Typography, { sx: { fontSize: '20px' }, children: block.split('\n').map((line, idx) => {
                        const bulletMatch = bulletRegex.exec(line);
                        const numberedMatch = numberedRegex.exec(line);
                        if (bulletMatch) {
                            return (_jsxs("span", { children: ["\u2022 ", bulletMatch[1], _jsx("br", {})] }, `${id}-${index}-${idx}`));
                        }
                        else if (numberedMatch) {
                            return (_jsxs("span", { children: [idx + 1, ". ", numberedMatch[1], _jsx("br", {})] }, `${id}-${index}-${idx}`));
                        }
                        else {
                            return (_jsxs("span", { children: [line, _jsx("br", {})] }, `${id}-${index}-${idx}`));
                        }
                    }) }, `${id}-${index}`));
            }
        });
    };
    return role == 'assistant' ? (_jsxs(Box, { sx: {
            display: 'flex',
            p: 2,
            bgcolor: 'Background.paper',
            gap: 2,
            borderRadius: 2,
            my: 1
        }, children: [_jsx(Avatar, { sx: { ml: '0' }, children: _jsx(AutoAwesomeOutlinedIcon, {}) }), _jsx(Box, { children: renderContent() })] })) : (_jsxs(Box, { sx: {
            display: 'flex',
            p: 2,
            bgcolor: theme.palette.chatInput.main,
            gap: 2,
            borderRadius: 2
        }, children: [_jsxs(Avatar, { sx: { ml: '0' }, children: [(_a = auth === null || auth === void 0 ? void 0 : auth.user) === null || _a === void 0 ? void 0 : _a.name[0], ((_b = auth === null || auth === void 0 ? void 0 : auth.user) === null || _b === void 0 ? void 0 : _b.name.split(' ')[1])
                        ? (_c = auth === null || auth === void 0 ? void 0 : auth.user) === null || _c === void 0 ? void 0 : _c.name.split(' ')[1][0]
                        : ''] }), _jsx(Box, { children: renderContent() })] }));
};
export default ChatItem;
