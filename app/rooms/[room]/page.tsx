"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Play, Pause } from "lucide-react";
import { toast } from 'sonner';

interface Song {
  _id: string;
  title: string;
  artist: string;
  duration: string;
  votes: number;
  url: string;
}

function SongQueue({ songs, onVote }: { songs: Song[], onVote: (songId: string, vote: 'up' | 'down') => void }) {
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = (songId: string) => {
    if (currentSong === songId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(songId);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-4">
      {songs.map((song) => (
        <Card key={song._id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePlayPause(song._id)}
              >
                {currentSong === song._id && isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <div>
                <h3 className="font-medium">{song.title}</h3>
                <p className="text-sm text-muted-foreground">
                  by {song.artist} • {song.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onVote(song._id, 'up')}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <span className="text-sm">{song.votes}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onVote(song._id, 'down')}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function RoomContent({ roomId }: { roomId: string }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`/api/songs?room=${roomId}`);
        if (!response.ok) throw new Error('Failed to fetch songs');
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        toast.error('Failed to load songs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [roomId]);

  const handleVote = async (songId: string, vote: 'up' | 'down') => {
    try {
      const response = await fetch(`/api/songs/${songId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote }),
      });

      if (!response.ok) throw new Error('Failed to vote');

      const updatedSong = await response.json();
      setSongs(songs.map(song => 
        song._id === songId ? updatedSong : song
      ));
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold capitalize">
            {roomId} Room
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Welcome to the {roomId} room! Listen to curated music and vote for your favorites.
          </p>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </Card>
              ))}
            </div>
          ) : (
            <SongQueue songs={songs} onVote={handleVote} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function RoomPage({ params }: { params: { room: string } }) {
  return (
    <div className="container mx-auto py-8">
      <RoomContent roomId={params.room} />
    </div>
  );
}