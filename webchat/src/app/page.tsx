"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import { ChatSession, Message } from '@/lib/types';

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('orthodox-chat-sessions');
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored sessions", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('orthodox-chat-sessions', JSON.stringify(sessions));
    }
  }, [sessions, isLoaded]);

  // MediaRecorder refs to hold audio data
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  // Derivé current session and messages
  const activeSession = sessions.find((s) => s.id === activeSessionId) || {
    id: 'new',
    title: 'Новая беседа',
    preview: '',
    date: new Date().toISOString(),
    messages: []
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setIsSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setIsSidebarOpen(false);
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSendMessage = async (content: string, isVoice: boolean) => {
    const newMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      isVoice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let sessionBase = activeSession;
    if (activeSessionId === null) {
      sessionBase = {
        ...activeSession,
        id: generateId(),
        title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
        preview: content.substring(0, 50),
        messages: [newMessage]
      };
      setSessions((prev) => [sessionBase, ...prev]);
      setActiveSessionId(sessionBase.id);
    } else {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionBase.id
            ? { ...s, preview: content.substring(0, 50), messages: [...s.messages, newMessage] }
            : s
        )
      );
    }

    setIsLoading(true);

    try {
      // Create message array for the API
      const apiMessages = [...sessionBase.messages].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: generateId(),
        role: data.role || 'assistant',
        content: data.content || 'Простите, сейчас я не могу ответить. Попробуйте еще раз с Божьей помощью.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionBase.id
            ? { ...s, messages: [...s.messages, assistantMessage] }
            : s
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release the microphone completely
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        setIsLoading(true);
        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'voice-message.webm');

          const sttResponse = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
          });

          if (!sttResponse.ok) {
            throw new Error(`STT failed: ${sttResponse.statusText}`);
          }

          const sttData = await sttResponse.json();
          const transcribedText = sttData.text;

          if (transcribedText && transcribedText.trim()) {
            handleSendMessage(transcribedText, true);
          } else {
            console.error('Empty transcription result.');
          }
        } catch (error) {
          console.error('STT error:', error);
          handleSendMessage("Извините, не удалось распознать голос. Попробуйте еще раз или напишите текстом.", true);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access your microphone.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      setIsRecording(false);
    }
  };

  return (
    <main className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onScenarioClick={(scenario) => {
          handleSendMessage(scenario, false);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <ChatArea
        messages={activeSession.messages || []}
        isRecording={isRecording}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
    </main>
  );
}
