
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { PaperPlaneIcon, RobotIcon, UserIcon } from './icons';

interface AiAssistantProps {
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const AiAssistant = ({ history, onSendMessage, isLoading }: AiAssistantProps) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <h3 className="text-lg font-semibold text-white p-3 border-b border-gray-700 flex items-center">
        <RobotIcon className="w-6 h-6 mr-2 text-blue-400"/>
        AI Solar Analyst
      </h3>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><RobotIcon className="w-5 h-5 text-white" /></div>}
            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'ai' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p>
            </div>
            {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0"><UserIcon className="w-5 h-5 text-white"/></div>}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><RobotIcon className="w-5 h-5 text-white" /></div>
                <div className="max-w-md p-3 rounded-lg bg-gray-700 text-gray-200">
                  <div className="flex items-center space-x-1">
                      <span className="h-2 w-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-blue-300 rounded-full animate-bounce"></span>
                  </div>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the forecast..."
          className="flex-grow bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()} className="ml-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 disabled:bg-gray-500 disabled:cursor-not-allowed transition">
          <PaperPlaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
