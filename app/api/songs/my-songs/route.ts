import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth-options';
import connectDB from '@/lib/mongodb';
import Song from '@/lib/models/song';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in my-songs:', {
      userId: session?.user?.id,
      userRole: session?.user?.role
    });
    
    if (!session?.user?.id || session.user.role !== 'creator') {
      console.log('Unauthorized access attempt to my-songs');
      return NextResponse.json(
        { error: 'Unauthorized - Must be logged in as a creator' },
        { status: 401 }
      );
    }

    await connectDB();
    console.log('Connected to database, fetching songs for creator:', session.user.id);

    const songs = await Song.find({ creatorId: session.user.id })
      .sort({ createdAt: -1 })
      .exec();

    console.log(`Found ${songs.length} songs for creator`);
    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error in my-songs route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 