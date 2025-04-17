'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  }

  interface Session {
    user: User;
  }
}

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Song {
  _id: string;
  title: string;
  artist: string;
  room: string;
  duration: string;
  createdAt: string;
}

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    duration: '',
    room: '',
    url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mySongs, setMySongs] = useState<Song[]>([]);

  const rooms = ['pop', 'lofi', 'chill', 'edm', 'hip-hop', 'jazz'];

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user || session.user.role !== 'creator') {
      router.push('/');
      return;
    }

    const fetchMySongs = async () => {
      try {
        const response = await fetch('/api/songs/my-songs');
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch songs');
        }
        const data = await response.json();
        setMySongs(data);
      } catch (error) {
        console.error('Error fetching songs:', error);
        toast.error('Failed to load your songs');
      }
    };

    fetchMySongs();
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'creator') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!session.user?.id) {
        throw new Error('User ID not found');
      }

      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          room: formData.room.toLowerCase(),
          creatorId: session.user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add song');
      }

      setMySongs(prev => [data, ...prev]);
      toast.success('Song added successfully!');
      setFormData({
        title: '',
        artist: '',
        duration: '',
        room: '',
        url: ''
      });
    } catch (error) {
      console.error('Error adding song:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add song');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Add a New Song</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Song Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (MM:SS)</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="3:45"
                  pattern="[0-9]{1,2}:[0-9]{2}"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Select
                  value={formData.room}
                  onValueChange={(value) => setFormData({ ...formData, room: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room.charAt(0).toUpperCase() + room.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Song URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  type="url"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Adding Song...' : 'Add Song'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Songs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mySongs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  You haven't added any songs yet.
                </p>
              ) : (
                mySongs.map((song) => (
                  <Card key={song._id} className="p-4">
                    <div className="space-y-1">
                      <h3 className="font-medium">{song.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Artist: {song.artist}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Room: {song.room.charAt(0).toUpperCase() + song.room.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {song.duration}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Added: {new Date(song.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 