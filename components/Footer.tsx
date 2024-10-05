import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Get Started</h3>
            <ul className="space-y-2">
              <li><Link href="/download" className="hover:text-primary">Download</Link></li>
              <li><Link href="/create-theme" className="hover:text-primary">Create a Theme</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Get Help</h3>
            <ul className="space-y-2">
              <li><Link href="/discord" className="hover:text-primary">Discord</Link></li>
              <li><Link href="/report-issue" className="hover:text-primary">Report an Issue</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/documentation" className="hover:text-primary">Documentation</Link></li>
              <li><Link href="/release-notes" className="hover:text-primary">Release Notes</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2024 AttendanceTracker. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="https://github.com" className="text-muted-foreground hover:text-primary">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="https://linkedin.com" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;