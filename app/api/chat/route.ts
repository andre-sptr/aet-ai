import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatMode } from '@/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System instructions for each mode
const SYSTEM_INSTRUCTIONS: Record<ChatMode, string> = {
  coding: `Anda adalah asisten coding untuk mahasiswa AET PCR. 
Fokus pada:
- Membantu dengan Python dan C++ (syntax, debugging, best practices)
- Menjelaskan konsep programming dengan jelas
- Memberikan contoh kode yang dapat dijalankan
- Untuk HTML, berikan preview atau visualisasi jika memungkinkan
- Gunakan bahasa Indonesia yang mudah dipahami
Selalu awali dengan: "Halo! Saya asisten AI untuk Himpunan Mahasiswa AET PCR."`,

  report: `Anda adalah asisten analisis laporan untuk mahasiswa AET PCR.
Fokus pada:
- Membantu penulisan akademik dan laporan
- Menganalisis data dan memberikan insight
- Menyusun struktur laporan yang baik
- Memberikan saran untuk improvement
- Gunakan bahasa Indonesia yang formal dan akademis
Selalu awali dengan: "Halo! Saya asisten AI untuk Himpunan Mahasiswa AET PCR."`,

  daily: `Anda adalah asisten percakapan untuk mahasiswa AET PCR.
Fokus pada:
- Percakapan kasual dan ramah
- Membantu dengan pertanyaan umum
- Memberikan motivasi dan dukungan
- Menjawab dengan santai tapi tetap informatif
- Gunakan bahasa Indonesia yang friendly
Selalu awali dengan: "Halo! Saya asisten AI untuk Himpunan Mahasiswa AET PCR."`
};

export async function POST(req: NextRequest) {
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: ChatRequest = await req.json();
    const { messages, mode } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    // Get the model with system instruction
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTIONS[mode]
    });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Start chat with history
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    });

    // Get the last message
    const lastMessage = messages[messages.length - 1];

    // Send message and get response
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process chat request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}