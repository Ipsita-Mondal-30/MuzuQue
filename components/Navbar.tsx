"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            Muzuque
          </Link>
          <Link 
            href="/rooms" 
            className={`text-sm hover:underline ${pathname === '/rooms' ? 'text-primary' : ''}`}
          >
            Rooms
          </Link>
          {session?.user?.role === 'creator' && (
            <Link 
              href="/create" 
              className={`text-sm hover:underline ${pathname === '/create' ? 'text-primary' : ''}`}
            >
              Create
            </Link>
          )}
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {status === 'loading' ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{session.user?.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <span className="capitalize">{session.user?.role}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/signup?role=listener">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}