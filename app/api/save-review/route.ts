import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { repoUrl, rating, chatLogs } = await req.json();

    const parsedRating = Number(rating);
    const isHalfStep = Number.isInteger(parsedRating * 2);

    if (!Number.isFinite(parsedRating) || parsedRating <= 0 || parsedRating > 5 || !isHalfStep) {
      return NextResponse.json({ success: false, error: 'Rating must be in 0.5 steps between 0.5 and 5.' }, { status: 400 });
    }

    const review = new Review({
      repoUrl,
      rating: parsedRating,
      chatLogs,
    });

    await review.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
