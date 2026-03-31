import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ reviews });
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch reviews.';
    const errorName = error?.name || '';

    if (message.includes('MONGODB_URI')) {
      return NextResponse.json(
        {
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
          error:
            'Database connection failed. Verify MONGODB_URI and allow your current IP in MongoDB Atlas Network Access.',
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}