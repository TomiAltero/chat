import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { UserCircle2 } from 'lucide-react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const timeAgo = formatDistanceToNow(message.timestamp, { addSuffix: true });
  
  return (
    <div 
      className={`flex gap-3 mb-4 ${message.isOwn ? 'flex-row-reverse' : ''} animate-slideIn`}
    >
      <div className="flex-shrink-0 animate-fadeIn hidden sm:block">
        <UserCircle2 className="w-8 h-8 text-gray-400" />
      </div>
      <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
        <div 
          className={`px-4 py-2 rounded-2xl break-words animate-messageIn ${
            message.isOwn 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1 animate-fadeIn">{timeAgo}</span>
      </div>
    </div>
  );
}