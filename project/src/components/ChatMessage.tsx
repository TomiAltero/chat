import { useEffect, useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
  options?: { label: string; action: string }[];
}

export const ChatMessage = ({ message, onOptionSelect }: { message: Message; onOptionSelect: (action: string) => void }) => {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  useEffect(() => {
    if (message.options) {
      setIsOptionsVisible(true);
    }
  }, [message]);

  return (
    <div
      className={`flex items-start mb-4 ${message.isOwn ? "justify-end" : "justify-start"}`}
    >
      {!message.isOwn && <div className="mr-3 text-gray-600">{message.sender}:</div>}
      <div className={`max-w-xs ${message.isOwn ? "bg-blue-500 text-white" : "bg-gray-100"} p-3 rounded-lg shadow-sm`}>
        {message.content}
        {isOptionsVisible && message.options && (
          <div className="mt-2 space-y-2">
            {message.options.map((option) => (
              <button
                key={option.action}
                className="block w-full text-left text-blue-600"
                onClick={() => onOptionSelect(option.action)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
