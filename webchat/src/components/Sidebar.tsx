import React from 'react';
import { MessageSquare, Plus, Zap, X } from 'lucide-react';
import { ChatSession } from '../lib/types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onScenarioClick: (scenario: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const scenarios = [
  "Как побороть уныние и тревогу?",
  "О чём говорит Евангелие от Матфея?",
  "Утешение при потере близкого",
  "Как узнать волю Божию?"
];

export function Sidebar({ sessions, activeSessionId, onSelectSession, onNewChat, onScenarioClick, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 md:relative w-80 bg-slate-50 border-r border-slate-200 h-full flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 flex-shrink-0 flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Новая беседа
          </button>
        </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Прошлые беседы</h3>
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
            <p className="text-sm text-slate-500 italic">Нет прошлых бесед.</p>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Zap size={14} /> Частые вопросы
          </h3>
          <div className="space-y-2">
            {scenarios.map((scenario, idx) => (
              <button
                key={idx}
                onClick={() => onScenarioClick(scenario)}
                className="w-full text-left p-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm text-sm text-slate-700 transition-all font-medium"
              >
                {scenario}
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
