import React from 'react';
import { MessageSquare, Plus, Zap, Heart } from 'lucide-react';
import { ChatSession } from '../lib/types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
}

const scenarios = [
  "I am feeling anxious today.",
  "How to find inner peace?",
  "Dealing with loss and grief.",
  "Guidance for a big decision."
];

export function Sidebar({ sessions, activeSessionId, onSelectSession, onNewChat }: SidebarProps) {
  return (
    <div className="w-80 bg-slate-50 border-r border-slate-200 h-full flex flex-col">
      <div className="p-4 flex-shrink-0">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={20} />
          New Journey
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Past Dialogues</h3>
        <div className="space-y-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                activeSessionId === session.id
                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <MessageSquare size={18} className="flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{session.title}</p>
                <p className="text-xs text-slate-500 truncate">{session.preview}</p>
              </div>
            </button>
          ))}
          {sessions.length === 0 && (
            <p className="text-sm text-slate-500 italic">No past dialogues found.</p>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Zap size={14} /> Quick Scenarios
          </h3>
          <div className="space-y-2">
            {scenarios.map((scenario, idx) => (
              <button
                key={idx}
                className="w-full text-left p-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm text-sm text-slate-700 transition-all"
              >
                {scenario}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Heart size={14} /> Emotional State Check-In
          </h3>
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-2">How are you feeling today?</p>
            <div className="flex justify-between gap-1">
              {['😔', '😐', '😌', '😊'].map((emoji, idx) => (
                <button
                  key={idx}
                  className="text-xl hover:scale-110 transition-transform bg-slate-50 p-2 rounded-full hover:bg-slate-100"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
