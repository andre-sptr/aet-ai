import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatMode } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

function cleanBase64(base64: string) {
  return base64.replace(/^data:(.*,)?/, '');
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const body: ChatRequest = await req.json();
    const { messages, mode } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTIONS[mode as ChatMode] || '' 
    });

    const history = messages.slice(0, -1).map(msg => {
      const parts: any[] = [{ text: msg.content }];
      if (msg.attachment) {
        parts.push({
          inlineData: {
            mimeType: msg.attachment.mimeType,
            data: cleanBase64(msg.attachment.content)
          }
        });
      }

      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: parts
      };
    });

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      }
    });

    const lastMessage = messages[messages.length - 1];
    
    const messageParts: any[] = [{ text: lastMessage.content }];
    if (lastMessage.attachment) {
      messageParts.push({
        inlineData: {
          mimeType: lastMessage.attachment.mimeType,
          data: cleanBase64(lastMessage.attachment.content)
        }
      });
    }

    const result = await chat.sendMessage(messageParts);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text })

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