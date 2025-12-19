'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Check, Mail, Sparkles, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden selection:bg-blue-500/30 text-white font-sans">
      
      <div 
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"
        style={{ transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)` }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
      />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl px-6">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white/90">AET AI</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
               {/* Social Icons */}
               <SocialLink 
                 title="@andree.sptrr" 
                 href="https://www.instagram.com/andree.sptrr/" 
                 icon={<Instagram className="w-4 h-4" />} 
               />
               <SocialLink 
                 title="Linkedin: andre-sptr" 
                 href="https://www.linkedin.com/in/andre-sptr/" 
                 icon={<Linkedin className="w-4 h-4" />} 
               />
               <SocialLink 
                 title="Github: andre-sptr" 
                 href="https://github.com/andre-sptr/aet-ai" 
                 icon={<Github className="w-4 h-4" />} 
               />
            </div>
          </div>

          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              Segera Hadir
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400 leading-tight">
              Masa Depan AI <br />
              Sedang Dibangun.
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
              Kami sedang menyiapkan sesuatu yang luar biasa untuk merevolusi cara Anda bekerja. Bersiaplah untuk pengalaman AI yang lebih cerdas dan intuitif.
            </p>

            <div className="mt-10 max-w-md">
              {status === 'success' ? (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 animate-in fade-in slide-in-from-bottom-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Terima kasih!</p>
                    <p className="text-xs opacity-80">Kami akan memberi kabar saat peluncuran.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 group/input">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email Anda..."
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group/btn"
                  >
                    {status === 'loading' ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Beri Tahu Saya
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
              <p className="mt-4 text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Bergabung dalam antrean.
              </p>
            </div>
          </div>

          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none select-none hidden md:block">
             <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#3B82F6" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.4,70.5,31.4C58.9,41.4,46.9,48.6,35.2,56.7C23.5,64.8,12.1,73.8,-0.9,75.4C-13.9,77,-27.4,71.2,-38.6,62.8C-49.8,54.4,-58.7,43.4,-66.2,31.2C-73.7,19,-79.8,5.6,-78.4,-7.1C-77,-19.8,-68.1,-31.8,-57.6,-40.8C-47.1,-49.8,-35,-55.8,-22.7,-64.5C-10.4,-73.2,2.1,-84.6,15.2,-85.4C28.3,-86.3,42,-76.6,44.7,-76.4Z" transform="translate(100 100)" />
             </svg>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
           <p> &copy; {new Date().getFullYear()} AET AI Project. All rights reserved.</p>
           <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
           </div>
        </div>
      </div>
    </div>
  );
}

function SocialLink({ href, icon, title }: { href: string; icon: React.ReactNode; title?: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-110 text-slate-400 hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
}