import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth-options';
import connectDB from '@/lib/mongodb';
import Song from '@/lib/models/song';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', { 
      userId: session?.user?.id,
      userRole: session?.user?.role 
    });
    
    if (!session?.user || session.user.role !== 'creator') {
      return NextResponse.json(
        { error: 'Unauthorized - Must be a creator' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Received song data:', { 
      ...body,
      url: '[REDACTED]',
      creatorId: body.creatorId 
    });

    const { title, artist, duration, room, url, creatorId } = body;

    // Validate all required fields
    if (!title || !artist || !duration || !room || !url || !creatorId) {
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!artist) missingFields.push('artist');
      if (!duration) missingFields.push('duration');
      if (!room) missingFields.push('room');
      if (!url) missingFields.push('url');
      if (!creatorId) missingFields.push('creatorId');

      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate room type
    const validRooms = ['pop', 'lofi', 'chill', 'edm', 'hip-hop', 'jazz'];
    if (!validRooms.includes(room.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid room type. Must be one of: ${validRooms.join(', ')}` },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      console.log('Connected to database');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    try {
      const song = await Song.create({
        title,
        artist,
        duration,
        room: room.toLowerCase(),
        url,
        creatorId,
        votes: 0,
        createdAt: new Date()
      });
      console.log('Song created successfully:', { 
        id: song._id, 
        title: song.title,
        room: song.room 
      });
      return NextResponse.json(song, { status: 201 });
    } catch (mongoError: any) {
      console.error('MongoDB error:', mongoError);
      return NextResponse.json(
        { error: mongoError.message || 'Failed to create song' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating song:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const room = searchParams.get('room');

    await connectDB();

    const query = room ? { room } : {};
    const songs = await Song.find(query)
      .sort({ votes: -1, createdAt: -1 })
      .exec();

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 