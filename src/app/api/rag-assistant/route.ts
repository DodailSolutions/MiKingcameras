import { NextResponse } from 'next/server';
import { queryRAGAssistant } from '@/lib/rag-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body?.prompt || body?.message || '';

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Inquiry prompt is required' },
        { status: 400 }
      );
    }

    const response = await queryRAGAssistant(prompt);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('RAG Assistant API Error:', error);
    return NextResponse.json(
      {
        answer: "I'm having trouble connecting to our store knowledge base right now. You can chat with Mohd Idrees on WhatsApp at +91 90322 85420 for immediate personal assistance.",
        sourceContexts: ['Fallback Store Hotline'],
        suggestedAction: {
          type: 'whatsapp',
          label: 'Chat with Mohd Idrees (+91 90322 85420)',
          href: 'https://wa.me/919032285420?text=Hello%20Mi%20Kings%20Cameras,%20I%20need%20help%20with%20an%20order',
        },
      },
      { status: 200 }
    );
  }
}
