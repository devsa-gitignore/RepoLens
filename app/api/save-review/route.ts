import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

type RawChatMessage = {
  role?: string;
  content?: string;
  parts?: Array<{ type?: string; text?: string }>;
};

function extractMessageText(message: RawChatMessage): string {
  if (typeof message?.content === 'string' && message.content.trim()) {
    return message.content.trim();
  }

  if (Array.isArray(message?.parts)) {
    const text = message.parts
      .filter((part) => part?.type === 'text' && typeof part?.text === 'string')
      .map((part) => part.text)
      .join(' ')
      .trim();

    if (text) {
      return text;
    }
  }

  return '';
}

function normalizeChatLogs(input: unknown): Array<{ role: 'user' | 'assistant'; content: string }> {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => item as RawChatMessage)
    .map((message) => ({
      role: message?.role === 'assistant' ? 'assistant' : 'user',
      content: extractMessageText(message),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-100);
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { repoUrl, rating, chatLogs } = await req.json();

    const parsedRating = Number(rating);
    const isHalfStep = Number.isInteger(parsedRating * 2);

    if (!Number.isFinite(parsedRating) || parsedRating <= 0 || parsedRating > 5 || !isHalfStep) {
      return NextResponse.json({ success: false, error: 'Rating must be in 0.5 steps between 0.5 and 5.' }, { status: 400 });
    }

    if (typeof repoUrl !== 'string' || !repoUrl.trim()) {
      return NextResponse.json({ success: false, error: 'Repository URL is required.' }, { status: 400 });
    }

    const normalizedChatLogs = normalizeChatLogs(chatLogs);

    const review = new Review({
      repoUrl: repoUrl.trim(),
      rating: parsedRating,
      chatLogs: normalizedChatLogs,
    });

    await review.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const message = error?.message || 'Failed to save review.';
    const errorName = error?.name || '';

    if (message.includes('MONGODB_URI')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database is not configured. Add MONGODB_URI to .env.local and restart the dev server.',
        },
        { status: 503 }
      );
    }

    if (
      errorName === 'MongoServerSelectionError' ||
      message.includes('Could not connect to any servers in your MongoDB Atlas cluster') ||
      message.includes('ECONNREFUSED') ||
      message.includes('ENOTFOUND') ||
      message.includes('ETIMEDOUT')
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Database connection failed. Verify MONGODB_URI and allow your current IP in MongoDB Atlas Network Access.',
        },
        { status: 503 },
      );
    }

    if (error?.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
