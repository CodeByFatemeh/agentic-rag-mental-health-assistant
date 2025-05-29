"use strict";
// import { useState } from 'react'
// import { Box, Avatar, Typography, IconButton } from '@mui/material'
// import FileCopyIcon from '@mui/icons-material/FileCopy'
// import CheckIcon from '@mui/icons-material/Check'
// import toast from 'react-hot-toast'
// import { useAuth } from '../../context/AuthContext'
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import OpenAIIcon from '../../../public/img/chatbot.webp'
// function extractCodeFromString (message: string) {
//   if (message.includes('```')) {
//     return message.split('```')
//   }
//   return undefined
// }
// function isCodeBlock (str: string) {
//   return (
//     str.includes('=') ||
//     str.includes(';') ||
//     str.includes('[') ||
//     str.includes(']') ||
//     str.includes('{') ||
//     str.includes('}') ||
//     str.includes('#') ||
//     str.includes('//')
//   )
// }
// const ChatItem = ({
//   content,
//   role,
//   id
// }: {
//   content: string
//   role: 'user' | 'assistant' | 'system'
//   id: string
// }) => {
//   const [copied, setCopied] = useState(false)
//   const messageBlocks = extractCodeFromString(content)
//   const auth = useAuth()
//   const handleCopyCode = (code: string) => {
//     navigator.clipboard.writeText(code)
//     setCopied(true)
//     toast.success('Code copied to clipboard!')
//     setTimeout(() => {
//       setCopied(false)
//     }, 2000)
//   }
//   const renderContent = () => {
//     const bulletRegex = /^(?:-|\*|\u2022)\s+(.+)$/; // Regex for -, *, and •
//     const numberedRegex = /^\d+\.\s+(.+)$/; // Regex for numbered lists
//     if (!messageBlocks) {
//       return (
//         <Typography sx={{ fontSize: '20px' }}>
//           {content.split('\n').map((line, index) => (
//             <span key={`${id}-${index}-${index}`}>
//               • {line}
//               <br />
//             </span>
//           ))}
//         </Typography>
//       )
//     }
//     return messageBlocks.map((block, index) => {
//       if (isCodeBlock(block)) {
//         const language = block.split('\n')[0].trim()
//         const code = block.substring(language.length).trim()
//         return (
//           <Box key={`${id}-${index}`} sx={{ position: 'relative' }}>
//             <SyntaxHighlighter
//               style={coldarkDark}
//               language={language || 'javascript'}
//             >
//               {code}
//             </SyntaxHighlighter>
//             <IconButton
//               onClick={() => handleCopyCode(code)}
//               sx={{ position: 'absolute', top: 0, right: 0, color: 'white' }}
//             >
//               {copied ? <CheckIcon /> : <FileCopyIcon />}
//             </IconButton>
//           </Box>
//         )
//       } else {
//         return (
//           <Typography key={`${id}-${index}`} sx={{ fontSize: '20px' }}>
//             {block.split('\n').map((line, idx) => (
//               <span key={`${id}-${index}-${idx}`}>
//                 • {line}
//                 <br />
//               </span>
//             ))}
//           </Typography>
//         )
//       }
//     })
//   }
//   return role == 'assistant' ? (
//     <Box
//       sx={{
//         display: 'flex',
//         p: 2,
//         bgcolor: 'lightblue',
//         gap: 2,
//         borderRadius: 2,
//         my: 1
//       }}
//     >
//       <Avatar sx={{ ml: '0', backgroundColor: 'white' }}>
//         <img src={OpenAIIcon} alt='openai' width={'30px'} />
//       </Avatar>
//       <Box>{renderContent()}</Box>
//     </Box>
//   ) : (
//     <Box
//       sx={{
//         display: 'flex',
//         p: 2,
//         bgcolor: '#ffffff',
//         gap: 2,
//         borderRadius: 2
//       }}
//     >
//       <Avatar sx={{ ml: '0', bgcolor: 'black', color: 'white' }}>
//         {auth?.user?.name[0]}
//         {auth?.user?.name.split(' ')[1]
//           ? auth?.user?.name.split(' ')[1][0]
//           : ''}
//       </Avatar>
//       <Box>{renderContent()}</Box>
//     </Box>
//   )
// }
// export default ChatItem
