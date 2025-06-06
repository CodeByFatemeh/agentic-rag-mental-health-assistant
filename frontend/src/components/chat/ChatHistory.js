import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Drawer, List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
export const ChatHistory = ({ sessions, currentSessionId, onSelectSession, onDeleteSession, isDrawerOpen, onToggleDrawer, }) => {
    const renderHistoryList = (isDrawer = false) => (_jsxs(Box, { sx: {
            p: { xs: isDrawer ? 2 : 1, sm: isDrawer ? 3 : 2 },
            overflowY: 'auto',
            height: '100%',
            bgcolor: 'background.paper',
            ...(isDrawer ? {} : {
                width: { xs: '100%', sm: '35vw', md: 'clamp(250px, 25vw, 350px)' },
                maxWidth: '100%',
                minWidth: { xs: '100%', sm: '200px', md: '250px' },
                display: { xs: 'none', md: 'block' },
                borderRight: { md: '1px solid #ddd' },
            }),
        }, children: [_jsx(Typography, { variant: "h6", sx: { fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontWeight: 500, mb: 2 }, children: "Chat Sessions" }), _jsx(List, { sx: { pr: 1 }, children: sessions.map((session) => {
                    var _a, _b;
                    return (_jsxs(ListItem, { onClick: () => onSelectSession(session.sessionId), sx: {
                            bgcolor: session.sessionId === currentSessionId ? 'grey.200' : 'transparent',
                            borderRadius: 1,
                            mb: 1,
                            py: 1.5,
                            px: 2,
                            transition: 'background-color 0.2s',
                            '&:hover': { bgcolor: 'grey.100' },
                            cursor: 'pointer',
                        }, children: [_jsx(ListItemText, { primary: (_a = session.title) !== null && _a !== void 0 ? _a : `Chat ${moment(session.createdAt).format('MMM D, YYYY')}`, secondary: moment(session.createdAt).fromNow(), primaryTypographyProps: {
                                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                    noWrap: true,
                                }, secondaryTypographyProps: {
                                    fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                                    noWrap: true,
                                } }), _jsx(IconButton, { edge: "end", onClick: (e) => { e.stopPropagation(); onDeleteSession(session.sessionId); }, "aria-label": `Delete session ${(_b = session.title) !== null && _b !== void 0 ? _b : session.sessionId}`, sx: { p: 0.5 }, children: _jsx(DeleteIcon, { fontSize: "small" }) })] }, session.sessionId));
                }) })] }));
    return (_jsxs(_Fragment, { children: [renderHistoryList(), _jsx(Drawer, { anchor: "left", open: isDrawerOpen, onClose: onToggleDrawer, sx: {
                    '& .MuiDrawer-paper': {
                        width: { xs: '80vw', sm: 'clamp(350px, 40vw, 400px)' },
                        maxWidth: '100%',
                        bgcolor: 'background.paper',
                    },
                }, children: renderHistoryList(true) })] }));
};
