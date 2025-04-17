import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function RoomsPage() {
  const rooms = [
    { genre: 'Pop', listeners: 234, trending: true },
    { genre: 'Lofi', listeners: 156, trending: true },
    { genre: 'Chill', listeners: 189, trending: false },
    { genre: 'EDM', listeners: 145, trending: true },
    { genre: 'Hip-Hop', listeners: 201, trending: false },
    { genre: 'Jazz', listeners: 98, trending: false },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Music Rooms</h1>
        <p className="text-muted-foreground">
          Join a room to discover music curated by creators and connect with other listeners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.genre} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{room.genre}</h3>
              {room.trending && (
                <div className="flex items-center text-primary">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">Trending</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center text-muted-foreground mb-4">
              <Users className="w-4 h-4 mr-2" />
              <span>{room.listeners} listeners</span>
            </div>

            <Link href={`/rooms/${room.genre.toLowerCase()}`}>
              <Button className="w-full">
                Join Room
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}