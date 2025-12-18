'use client';

import { ChatModeConfig } from '@/types';
import { Code2, FileText, MessageCircle, Sparkles, Zap, Shield } from 'lucide-react';

interface LandingPageProps {
  onSelectMode: (mode: ChatModeConfig) => void;
}

const CHAT_MODES: ChatModeConfig[] = [
  {
    id: 'coding',
    title: 'Coding Assistant',
    description: 'Bantuan untuk Python, C++, dan HTML dengan preview code',
    icon: 'code',
    systemInstruction: '',
    color: 'blue'
  },
  {
    id: 'report',
    title: 'Report Analysis',
    description: 'Analisis laporan akademik dan penulisan ilmiah',
    icon: 'file',
    systemInstruction: '',
    color: 'green'
  },
  {
    id: 'daily',
    title: 'Daily Activities',
    description: 'Percakapan kasual dan bantuan sehari-hari',
    icon: 'message',
    systemInstruction: '',
    color: 'purple'
  }
];

const getIcon = (iconName: string, className: string = '') => {
  const icons = {
    code: Code2,
    file: FileText,
    message: MessageCircle
  };
  const Icon = icons[iconName as keyof typeof icons] || MessageCircle;
  return <Icon className={className} />;
};

const getGradientClass = (color: string) => {
  const gradients = {
    blue: 'card-gradient-blue',
    green: 'card-gradient-green',
    purple: 'card-gradient-purple'
  };
  return gradients[color as keyof typeof gradients] || 'card-gradient-blue';
};

export default function LandingPage({ onSelectMode }: LandingPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0056D2] via-[#0056D2] to-[#003d96]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAgMnYyaDJ2LTJoLTJ6bTItMmgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 animate-fade-in">
          <div className="text-center">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-2 glass-effect px-6 py-3 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Powered by Gemini AI</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              AET AI
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto mb-6" />
            
            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-blue-100 font-medium mb-2">
              Asisten AI untuk Mahasiswa AET
            </p>
            <p className="text-lg text-blue-200/80">
              Politeknik Caltex Riau
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-sm text-white">Respon Cepat</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Shield className="w-4 h-4 text-green-300" />
                <span className="text-sm text-white">Tanpa Login</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-white">Multi Mode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
            Pilih Mode Asisten Anda
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Setiap mode dirancang khusus untuk membantu kebutuhan spesifik Anda dengan teknologi AI terkini
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {CHAT_MODES.map((mode, index) => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode)}
              className="group relative animate-slide-up hover:scale-105 transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Container */}
              <div className="relative h-full glass-effect rounded-3xl p-8 overflow-hidden">
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 ${getGradientClass(mode.color)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <div className="mb-6 relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-white/20 group-hover:to-white/10 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 mx-auto">
                      {getIcon(mode.icon, 'w-10 h-10 text-[#0056D2] group-hover:text-white transition-colors duration-500')}
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-[#1A1A1A] group-hover:text-white mb-3 transition-colors duration-500">
                    {mode.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 group-hover:text-white/90 leading-relaxed mb-6 transition-colors duration-500">
                    {mode.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center justify-center gap-2 text-[#0056D2] group-hover:text-white font-semibold transition-colors duration-500">
                    <span>Mulai Sekarang</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Info Section */}
        <div className="text-center space-y-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="inline-flex items-center gap-3 glass-effect px-8 py-4 rounded-2xl">
            <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
            <p className="text-gray-700 font-medium">
              Didukung oleh Google Gemini AI • Gratis untuk semua mahasiswa AET
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}