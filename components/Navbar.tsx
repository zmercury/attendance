import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Moon, Sun, Menu, User } from 'lucide-react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className={`bg-background border-b border-border py-3 ${className}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-foreground text-xl font-bold">
          AttendanceTracker
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/docs">Docs</NavLink>
          {user ? (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-secondary/50">
                  <span className="text-1xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient bg-300%">
                    Hi, {user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={() => router.push('/login')} variant="outline">
              Login
            </Button>
          )}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-2"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>
        <div className="md:hidden flex items-center">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="mr-2"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-4">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/docs">Docs</NavLink>
                {user ? (
                  <>
                    <NavLink href="/dashboard">Dashboard</NavLink>
                    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-secondary/50">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient bg-300%">
                        {user.email?.split('@')[0] || 'User'}
                      </span>
                    </div>
                    <Button onClick={handleSignOut} variant="outline">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => router.push('/login')} variant="outline">
                    Login
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link
    href={href}
    className="text-foreground hover:text-primary transition duration-300 font-semibold"
  >
    {children}
  </Link>
);

export default Navbar;

