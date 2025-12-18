'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import ChatInterface from '@/components/ChatInterface';
import { ChatModeConfig } from '@/types';

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<ChatModeConfig | null>(null);

  const handleSelectMode = (mode: ChatModeConfig) => {
    setSelectedMode(mode);
  };

  const handleBack = () => {
    setSelectedMode(null);
  };

  if (selectedMode) {
    return (
      <ChatInterface
        mode={selectedMode.id}
        modeTitle={selectedMode.title}
        onBack={handleBack}
      />
    );
  }

  return <LandingPage onSelectMode={handleSelectMode} />;
}