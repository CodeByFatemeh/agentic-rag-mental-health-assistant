import './TypingIndicator.scss'

export const TypingIndicator = ({isTyping}: {isTyping: boolean}) => {

  return (
    isTyping && (
        <div className="typing-indicator">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    )
  );
};
