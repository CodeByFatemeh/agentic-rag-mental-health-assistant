import { useState } from 'react';
import { Box, Avatar, Typography, IconButton, useTheme } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckIcon from '@mui/icons-material/Check';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMessage } from '../../types';

function extractCodeFromString(content: string): string[] | undefined {
  if (content.includes('```')) {
    return content.split('```');
  }
  return undefined;
}

function isCodeBlock(str: string): boolean {
  return (
    str.includes('=') ||
    str.includes(';') ||
    str.includes('[') ||
    str.includes(']') ||
    str.includes('{') ||
    str.includes('}') ||
    str.includes('#') ||
    str.includes('//')
  );
}

interface ChatItemProps {
  message: ChatMessage;
}

export const ChatItem: React.FC<ChatItemProps> = ({ message }) => {
  const { content, role, _id: id, sources } = message
  const [copied, setCopied] = useState(false);
  const messageBlocks = extractCodeFromString(content);
  const { user } = useAuth();
  const theme = useTheme();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    if (!messageBlocks) {
      const bulletRegex = /^[-*\u2022]\s+(.+)$/;
      const numberedRegex = /^\d+\.\s+(.+)$/;

      return (
        <Typography sx={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
          {content.split('\n').map((line, index) => {
            const bulletMatch = bulletRegex.exec(line);
            const numberedMatch = numberedRegex.exec(line);

            if (bulletMatch) {
              return (
                <span key={`${id}-${index}`}>
                  • {bulletMatch[1]}
                  <br />
                </span>
              );
            } else if (numberedMatch) {
              return (
                <span key={`${id}-${index}`}>
                  {index + 1}. {numberedMatch[1]}
                  <br />
                </span>
              );
            } else {
              return (
                <span key={`${id}-${index}`}>
                  {line}
                  <br />
                </span>
              );
            }
          })}
        </Typography>
      );
    }

    return messageBlocks.map((block, index) => {
      if (isCodeBlock(block)) {
        const language = block.split('\n')[0].trim();
        const code = block.substring(language.length).trim();

        return (
          <Box key={`${id}-${index}`} sx={{ position: 'relative', my: 1 }}>
            <SyntaxHighlighter
              style={coldarkDark}
              language={language || 'javascript'}
              customStyle={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', borderRadius: 4 }}
            >
              {code}
            </SyntaxHighlighter>
            <IconButton
              onClick={() => handleCopyCode(code)}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                color: theme.palette.text.secondary,
                bgcolor: theme.palette.background.default,
                '&:hover': { bgcolor: theme.palette.grey[100] },
              }}
            >
              {copied ? <CheckIcon fontSize="small" /> : <FileCopyIcon fontSize="small" />}
            </IconButton>
          </Box>
        );
      } else {
        const bulletRegex = /^[-*\u2022]\s+(.+)$/;
        const numberedRegex = /^\d+\.\s+(.+)$/;

        return (
          <Typography key={`${id}-${index}`} sx={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
            {block.split('\n').map((line, idx) => {
              const bulletMatch = bulletRegex.exec(line);
              const numberedMatch = numberedRegex.exec(line);

              if (bulletMatch) {
                return (
                  <span key={`${id}-${index}-${idx}`}>
                    • {bulletMatch[1]}
                    <br />
                </span>
                );
              } else if (numberedMatch) {
                return (
                  <span key={`${id}-${index}-${idx}`}>
                    {idx + 1}. {numberedMatch[1]}
                    <br />
                </span>
                );
              } else {
                return (
                  <span key={`${id}-${index}-${idx}`}>
                    {line}
                    <br />
                </span>
                );
              }
            })}
          </Typography>
        );
      }
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        p: { xs: 1, sm: 1.5 },
        bgcolor: role === 'user' ? '#e3f2fd' : '#f5f5f5',
        borderRadius: 2,
        my: 1,
        gap: 1,
        maxWidth: '80%',
        alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: role === 'user' ? theme.palette.primary.main : theme.palette.secondary.main,
        }}
      >
        {role === 'user' && user?.name ? (
          `${user.name[0]}${user.name.split(' ')[1]?.[0] || ''}`
        ) : (
          <AutoAwesomeOutlinedIcon fontSize="small" />
        )}
      </Avatar>
      <Box sx={{ flexGrow: 1, wordBreak: 'break-word' }}>
        {renderContent()}
      
        {role === 'assistant' && sources && sources.length > 0 && (
          <Box
            sx={{
              mt: 2,
              pt: 1.5,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mb: 0.5,
                fontWeight: 600,
              }}
            >
              Sources
            </Typography>
      
            {sources.map((source, index) => (
              <Typography
                key={`${source.url ?? source.title ?? 'source'}-${index}`}
                variant="caption"
                sx={{
                  display: 'block',
                  mb: 0.25,
                }}
              >
                [{index + 1}]{' '}
      
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.title ?? source.source ?? source.url}
                  </a>
                ) : (
                  source.title ?? source.source ?? 'Retrieved source'
                )}
      
                {source.source &&
                  source.source !== source.title &&
                  ` — ${source.source}`}
              </Typography>
            ))}
          </Box>
  )}
</Box>
    </Box>
  );
};
