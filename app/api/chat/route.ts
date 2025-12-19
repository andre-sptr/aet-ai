import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatMode } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const BASE_SYSTEM_INSTRUCTIONS: Record<ChatMode, string> = {
  coding: `Anda adalah asisten coding untuk mahasiswa AET PCR. 
Fokus pada:
- Membantu dengan Python dan C++ (syntax, debugging, best practices)
- Menjelaskan konsep programming dengan jelas
- Memberikan contoh kode yang dapat dijalankan
- Untuk HTML, berikan preview atau visualisasi jika memungkinkan
- Gunakan bahasa Indonesia yang mudah dipahami
Selalu awali dengan: "Halo! Saya asisten AI Himpunan Mahasiswa AET PCR."`,

  report: `Anda adalah asisten analisis laporan untuk mahasiswa AET PCR.
Fokus pada:
- Membantu penulisan akademik dan laporan
- Menganalisis data dan memberikan insight
- Menyusun struktur laporan yang baik
- Memberikan saran untuk improvement
- Gunakan bahasa Indonesia yang formal dan akademis
Selalu awali dengan: "Halo! Saya asisten AI Himpunan Mahasiswa AET PCR."`,

  daily: `Anda adalah asisten percakapan untuk mahasiswa AET PCR.
Fokus pada:
- Percakapan kasual dan ramah
- Membantu dengan pertanyaan umum
- Memberikan motivasi dan dukungan
- Menjawab dengan santai tapi tetap informatif
- Gunakan bahasa Indonesia yang friendly
Selalu awali dengan: "Halo! Saya asisten AI Himpunan Mahasiswa AET PCR."`
};

function cleanBase64(base64: string) {
  return base64.replace(/^data:(.*,)?/, '');
}

async function fetchWeather(city: string) {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=id&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) return null;

    const { latitude, longitude, name, admin1, country } = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    
    const current = weatherData.current;
    
    const weatherCodes: Record<number, string> = {
      0: 'Cerah', 1: 'Cerah Berawan', 2: 'Berawan', 3: 'Mendung',
      45: 'Berkabut', 51: 'Gerimis Ringan', 61: 'Hujan', 63: 'Hujan Sedang',
      65: 'Hujan Lebat', 80: 'Hujan Lokal', 95: 'Badai Petir'
    };
    const condition = weatherCodes[current.weather_code] || 'Tidak diketahui';

    return `
    [DATA CUACA REAL-TIME DITEMUKAN]
    - Lokasi: ${name}, ${admin1 || ''}, ${country}
    - Kondisi: ${condition}
    - Suhu: ${current.temperature_2m}°C (Terasa seperti ${current.apparent_temperature}°C)
    - Kelembaban: ${current.relative_humidity_2m}%
    - Angin: ${current.wind_speed_10m} km/h
    Gunakan data ini untuk menjawab pertanyaan pengguna.`;
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
}

const CURRENCY_MAP: Record<string, string> = {
  'dolar': 'USD', 'dollar': 'USD', 'usd': 'USD', 'as': 'USD', 'us': 'USD',
  'rupiah': 'IDR', 'idr': 'IDR', 'indo': 'IDR', 'rp': 'IDR',
  'euro': 'EUR', 'eur': 'EUR', 'eropa': 'EUR',
  'yen': 'JPY', 'jpy': 'JPY', 'jepang': 'JPY',
  'ringgit': 'MYR', 'myr': 'MYR', 'malaysia': 'MYR',
  'singapura': 'SGD', 'sgd': 'SGD', 'sing': 'SGD',
  'pound': 'GBP', 'gbp': 'GBP', 'sterling': 'GBP', 'inggris': 'GBP',
  'won': 'KRW', 'krw': 'KRW', 'korea': 'KRW',
  'yuan': 'CNY', 'cny': 'CNY', 'china': 'CNY', 'rmb': 'CNY',
  'riyal': 'SAR', 'sar': 'SAR', 'arab': 'SAR'
};

async function fetchCurrency(amountStr: string | undefined, from: string, to: string | undefined) {
  try {
    const fromCode = CURRENCY_MAP[from.toLowerCase()] || from.toUpperCase();
    const toCode = to ? (CURRENCY_MAP[to.toLowerCase()] || to.toUpperCase()) : 'IDR'; 

    let amount = 1;
    if (amountStr) {
      const cleanStr = amountStr.replace(/\./g, '').replace(',', '.');
      amount = parseFloat(cleanStr);
    }
    if (isNaN(amount)) amount = 1;

    console.log(`Fetching Currency: ${amount} ${fromCode} to ${toCode}`);

    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCode}&to=${toCode}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.log('Currency API Error:', res.statusText);
      return null;
    }
    
    const data = await res.json();
    const rate = data.rates[toCode];
    const date = data.date;

    return `
    [DATA KURS REAL-TIME DITEMUKAN]
    - Sumber: Frankfurter API (Update: ${date})
    - Konversi: ${amount.toLocaleString('id-ID')} ${fromCode} = ${rate.toLocaleString('id-ID')} ${toCode}
    - Instruksi: Jawab langsung dengan angka di atas. Jangan ragu.`;
  } catch (error) {
    console.error('Currency fetch error:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages, mode, model: userModel, tools, clientInfo } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    let finalSystemInstruction = BASE_SYSTEM_INSTRUCTIONS[mode as ChatMode] || '';
    const lastUserMessage = messages[messages.length - 1].content.toLowerCase();

    let geminiTools: any[] = [];

    if (tools && tools.length > 0) {
      finalSystemInstruction += '\n\n=== SYSTEM TOOLS ACTIVATED ===\n';
      if (tools.includes('time')) {
        finalSystemInstruction += `\n[TOOL: WAKTU DUNIA]
        - Waktu Lokal User: ${clientInfo?.time}
        - Waktu Referensi UTC: ${clientInfo?.utcTime}
        - INSTRUKSI: Jika user bertanya jam di kota/negara lain, HITUNG offset dari waktu UTC di atas. Jangan mengarang.
        - Contoh: Jika UTC jam 12:00 dan user tanya WIB, jawab jam 19:00 (UTC+7).`;
      }
      if (tools.includes('weather')) {
        const weatherMatch = lastUserMessage.match(/(?:cuaca|weather)\s+(?:di|in|at)\s+([a-zA-Z\s]+)/i);
        
        if (weatherMatch && weatherMatch[1]) {
          const city = weatherMatch[1].trim();
          const weatherInfo = await fetchWeather(city);
          
          if (weatherInfo) {
            finalSystemInstruction += `\n${weatherInfo}`;
          } else {
             finalSystemInstruction += `\n[INFO] Gagal mengambil data cuaca untuk ${city}. Beritahu user untuk cek nama kota.`;
          }
        } else {
          finalSystemInstruction += `\n[TOOL: CUACA]
          - Fitur aktif. Jika user ingin tahu cuaca, minta mereka mengetik format: "Cuaca di [Nama Kota]".`;
        }
      }
      if (tools.includes('calculator')) {
        geminiTools.push({ codeExecution: {} });
        
        finalSystemInstruction += `\n[TOOL: KALKULATOR / PYTHON]
        - Mode Eksekusi Kode AKTIF.
        - Jika pengguna meminta perhitungan matematika, JANGAN hitung manual.
        - WAJIB tulis dan jalankan kode Python untuk mendapatkan jawaban yang presisi.`;
      }
      if (tools.includes('currency')) {
        const currencyMatch = lastUserMessage.match(
          /(?:(\d+(?:[\.,]\d+)?)\s*)?([a-zA-Z]{3,}|dolar|rupiah|euro|yen|ringgit|pound|won|yuan|riyal)(?:\s*(?:ke|to|in|=)\s*([a-zA-Z]{3,}|dolar|rupiah|euro|yen|ringgit|pound|won|yuan|riyal))?/i
        );

        const keywords = ['convert', 'tukar', 'kurs', 'nilai', 'harga', 'usd', 'idr', 'dolar', 'rupiah'];
        const hasKeyword = keywords.some(k => lastUserMessage.includes(k));

        if (currencyMatch && hasKeyword) {
          const amountStr = currencyMatch[1];
          const fromCurr = currencyMatch[2];
          const toCurr = currencyMatch[3];

          const currencyInfo = await fetchCurrency(amountStr, fromCurr, toCurr);
          
          if (currencyInfo) {
            finalSystemInstruction += `\n${currencyInfo}`;
          }
        }
      }
    }

    const modelConfig: any = {
      model: userModel || 'gemini-2.5-flash',
      systemInstruction: finalSystemInstruction
    };

    if (geminiTools.length > 0) {
      modelConfig.tools = geminiTools;
    }

    const model = genAI.getGenerativeModel(modelConfig);

    const history = messages.slice(0, -1).map((msg: any) => {
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

    return NextResponse.json({ response: text });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    );
  }
}