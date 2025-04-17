import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Headphones, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to MusicStream
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Join the community of creators and listeners sharing music and inspiration
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup?role=creator">
              <Button size="lg" className="gap-2">
                <Music className="w-5 h-5" />
                I'm a Creator
              </Button>
            </Link>
            <Link href="/signup?role=listener">
              <Button size="lg" variant="outline" className="gap-2">
                <Headphones className="w-5 h-5" />
                I'm a Listener
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Pop', 'Lofi', 'Chill'].map((genre) => (
            <Card key={genre} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-semibold">{genre}</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Join the {genre} room and discover amazing music curated by top creators.
              </p>
              <Link href={`/rooms/${genre.toLowerCase()}`}>
                <Button variant="outline" className="w-full">
                  Join Room
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}