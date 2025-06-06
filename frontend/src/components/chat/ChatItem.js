import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Avatar, Typography, IconButton, useTheme } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckIcon from '@mui/icons-material/Check';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
function extractCodeFromString(content) {
    if (content.includes('```')) {
        return content.split('```');
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
export const ChatItem = ({ message }) => {
    var _a;
    const { content, role, _id: id } = message;
    const [copied, setCopied] = useState(false);
    const messageBlocks = extractCodeFromString(content);
    const { user } = useAuth();
    const theme = useTheme();
    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };
    const renderContent = () => {
        if (!messageBlocks) {
            const bulletRegex = /^[-*\u2022]\s+(.+)$/;
            const numberedRegex = /^\d+\.\s+(.+)$/;
            return (_jsx(Typography, { sx: { fontSize: 'clamp(0.875rem, 2vw, 1rem)' }, children: content.split('\n').map((line, index) => {
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
                return (_jsxs(Box, { sx: { position: 'relative', my: 1 }, children: [_jsx(SyntaxHighlighter, { style: coldarkDark, language: language || 'javascript', customStyle: { fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', borderRadius: 4 }, children: code }), _jsx(IconButton, { onClick: () => handleCopyCode(code), sx: {
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                color: theme.palette.text.secondary,
                                bgcolor: theme.palette.background.paper,
                                '&:hover': { bgcolor: theme.palette.grey[100] },
                            }, children: copied ? _jsx(CheckIcon, { fontSize: "small" }) : _jsx(FileCopyIcon, { fontSize: "small" }) })] }, `${id}-${index}`));
            }
            else {
                const bulletRegex = /^[-*\u2022]\s+(.+)$/;
                const numberedRegex = /^\d+\.\s+(.+)$/;
                return (_jsx(Typography, { sx: { fontSize: 'clamp(0.875rem, 2vw, 1rem)' }, children: block.split('\n').map((line, idx) => {
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
    return (_jsxs(Box, { sx: {
            display: 'flex',
            p: { xs: 1, sm: 1.5 },
            bgcolor: role === 'user' ? '#e3f2fd' : '#f5f5f5',
            borderRadius: 2,
            my: 1,
            gap: 1,
            maxWidth: '80%',
            alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
        }, children: [_jsx(Avatar, { sx: {
                    width: 32,
                    height: 32,
                    bgcolor: role === 'user' ? theme.palette.primary.main : theme.palette.secondary.main,
                }, children: role === 'user' && (user === null || user === void 0 ? void 0 : user.name) ? (`${user.name[0]}${((_a = user.name.split(' ')[1]) === null || _a === void 0 ? void 0 : _a[0]) || ''}`) : (_jsx(AutoAwesomeOutlinedIcon, { fontSize: "small" })) }), _jsx(Box, { sx: { flexGrow: 1, wordBreak: 'break-word' }, children: renderContent() })] }));
};
