import { NextResponse } from 'next/server';
import { queryRAGAssistant, sanitizeMemory } from '@/lib/rag-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body?.prompt || body?.message || '';
    const user = body?.user || null;
    const memory = sanitizeMemory(body?.memory);

    if (!prompt || typeof prompt !== 'string' || !prompt.trim() || prompt.length > 500) {
      return NextResponse.json(
        { error: 'Inquiry prompt is required' },
        { status: 400 }
      );
    }

    const response = await queryRAGAssistant(prompt, user, memory);
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('RAG Assistant API Error:', error);
    return NextResponse.json(
      {
        answer: "I'm having trouble connecting to our store catalog right now. You can chat with our team on WhatsApp at +91 90322 85420 for immediate assistance.",
        sourceContexts: ['Customer Help Desk'],
        suggestedAction: {
          type: 'whatsapp',
          label: 'Chat on WhatsApp',
          href: 'https://wa.me/919032285420',
        },
      },
      { status: 200 }
    );
  }
}
