import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Song from '@/lib/models/song';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { vote } = await req.json();
    const songId = params.id;

    await connectDB();

    const song = await Song.findById(songId);
    if (!song) {
      return NextResponse.json(
        { error: 'Song not found' },
        { status: 404 }
      );
    }

    song.votes += vote === 'up' ? 1 : -1;
    await song.save();

    return NextResponse.json(song);
  } catch (error) {
    console.error('Error voting on song:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 