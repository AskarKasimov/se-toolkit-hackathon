import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Loader2, User, Menu } from 'lucide-react';
import { Message } from '../lib/types';
import ReactMarkdown from 'react-markdown';

const OrthodoxCross = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20" />
    <path d="M6 8h12" />
    <path d="M10 4h4" />
    <path d="M9 14l6 4" />
  </svg>
);

interface ChatAreaProps {
  messages: Message[];
  isRecording: boolean;
  isTranscribing: boolean;
  isThinking: boolean;
  onSendMessage: (content: string, isVoice: boolean) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onToggleSidebar: () => void;
}

export function ChatArea({ messages, isRecording, isTranscribing, isThinking, onSendMessage, onStartRecording, onStopRecording, onToggleSidebar }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '56px';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = scrollHeight > 56 ? `${scrollHeight}px` : '56px';
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTranscribing, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isRecording || isTranscribing || isThinking) return;
    onSendMessage(input.trim(), false);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative w-full">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 z-10">
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <span className="font-semibold text-slate-800 text-lg flex items-center gap-2">
          <OrthodoxCross className="w-5 h-5 text-indigo-600" />
          Собеседник
        </span>
        <div className="w-10"></div> {/* Placeholder for flex balance */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col text-center px-4">
            <div className="bg-indigo-100 p-4 rounded-full mb-4">
              <OrthodoxCross className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Православный собеседник</h2>
            <p className="text-slate-500 max-w-md">Здесь вы можете задать вопросы о православной вере, Евангелии и духовной жизни. Отправьте текстовое или голосовое сообщение.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${message.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                  {message.role === 'user' ? <User className="text-white w-6 h-6" /> : <OrthodoxCross className="text-white w-6 h-6" />}
                </div>
                <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl shadow-sm border ${message.role === 'user' ? 'bg-indigo-50 border-indigo-100 rounded-tr-sm text-slate-800' : 'bg-white border-slate-200 rounded-tl-sm text-slate-800 prose prose-sm'}`}>
                    {message.isVoice && (
                      <div className="flex items-center gap-2 mb-2 text-indigo-600 bg-indigo-100/50 px-3 py-1 rounded-full text-xs font-medium w-fit">
                        <Mic size={14} /> Переведено из голоса
                      </div>
                    )}
                    {message.role === 'assistant' ? (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 mt-2">{message.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
        {isTranscribing && (
          <div className="flex justify-end">
            <div className="flex gap-4 max-w-3xl flex-row-reverse">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-indigo-600">
                <User className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col items-end">
                <div className="p-4 rounded-2xl shadow-sm border bg-indigo-50 border-indigo-100 rounded-tr-sm text-slate-800 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  <span className="text-sm font-medium text-slate-600">Распознаю голос...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {isThinking && (
          <div className="flex justify-start">
            <div className="flex gap-4 max-w-3xl flex-row">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-emerald-600">
                <OrthodoxCross className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col items-start">
                <div className="p-4 rounded-2xl shadow-sm border bg-white border-slate-200 rounded-tl-sm text-slate-800 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  <span className="text-sm font-medium text-slate-600">Обращаюсь к Писанию...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex items-start gap-3 px-2">
          <form className="flex-1 relative" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишите сообщение..."
              className="block w-full bg-slate-50 border border-slate-300 rounded-[24px] pl-5 pr-[60px] py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-[56px] max-h-32 transition-colors leading-relaxed"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isRecording || isTranscribing || isThinking}
              className="absolute right-[10px] bottom-[11px] p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-colors shadow-sm flex items-center justify-center h-[34px] w-[34px]"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>

          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`h-[56px] w-[56px] rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
            }`}
            title="Send Voice Message"
          >
            {isRecording ? <Square size={20} className="fill-current" /> : <Mic size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
