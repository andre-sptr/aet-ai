'use client';

import { ChatModeConfig } from '@/types';
import { Code2, FileText, MessageCircle, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface LandingPageProps {
  onSelectMode: (mode: ChatModeConfig) => void;
}

const CHAT_MODES: ChatModeConfig[] = [
  {
    id: 'daily',
    title: 'Smart Companion',
    description: 'Diskusi interaktif untuk produktivitas sehari-hari.',
    icon: 'message',
    systemInstruction: '',
    color: 'purple'
  },
  {
    id: 'report',
    title: 'Academic Writer',
    description: 'Analisis laporan, jurnal, dan penulisan PA terstruktur.',
    icon: 'file',
    systemInstruction: '',
    color: 'green'
  },
  {
    id: 'coding',
    title: 'Coding Expert',
    description: 'Debugging & penulisan kode Python, C++, HTML dengan presisi tinggi.',
    icon: 'code',
    systemInstruction: '',
    color: 'blue'
  }
];

export default function LandingPage({ onSelectMode }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <Image 
              src="/favicon.ico" 
              alt="Logo AET" 
              width={56} 
              height={56} 
              className="w-14 h-14 object-contain" 
              unoptimized
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none ">AET AI</h1>
              <p className="text-[14px] text-slate-500 font-medium tracking-wide">Himpunan Mahasiswa AET PCR</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/coming-soon" className="hover:text-blue-600 transition-colors">
              Berita
            </Link>
            <Link href="/coming-soon" className="hover:text-blue-600 transition-colors">
              Kegiatan
            </Link>
            <Link href="/coming-soon" className="hover:text-blue-600 transition-colors">
              Struktur Organisasi
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Online
            </div>
          </div>
        </div>
      </nav>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-blue-100/50 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-indigo-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-24 animate-fade-in px-4">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-600">AET Intelligence System</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 whitespace-nowrap">
            Halo! Selamat Datang di <span className="text-[#0056D2] tracking-wider ml-3">AET AI</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Saya adalah asisten AI Himpunan Mahasiswa AET Politeknik Caltex Riau. Pilih salah satu kemampuan di bawah untuk memulai percakapan.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-lg border border-slate-100">
              <Zap className="w-4 h-4 text-blue-500" /> Fast Response
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-lg border border-slate-100">
              <Shield className="w-4 h-4 text-green-500" /> Secure & Private
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {CHAT_MODES.map((mode, index) => {
            const icons = { code: Code2, file: FileText, message: MessageCircle };
            const Icon = icons[mode.icon as keyof typeof icons] || MessageCircle;
            
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode)}
                className="group relative flex flex-col items-start p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 animate-slide-up text-left overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-${mode.color === 'blue' ? 'blue' : mode.color === 'green' ? 'emerald' : 'violet'}-50/50 to-transparent`} />

                <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 
                  ${mode.color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 
                    mode.color === 'green' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 
                    'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white'}`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="relative z-10 text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-900">
                  {mode.title}
                </h3>
                
                <p className="relative z-10 text-slate-500 leading-relaxed mb-8 flex-1">
                  {mode.description}
                </p>

                <div className="relative z-10 flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:gap-3 transition-all">
                  Mulai Chat <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <footer className="relative z-10 py-6 mt-20 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-black font-medium text-sm tracking-wide">
            &copy; {new Date().getFullYear()} Association of <span className="text-[#D32F2F]">Electro</span>nics Telecommunication
          </p>
          <p className="text-[#0056D2] font-semibold text-xs mt-2">
            Politeknik Caltex Riau
          </p>
        </div>
      </footer>
    </div>
  );
}