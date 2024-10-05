import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/router';

const Hero: React.FC = () => {
    const router = useRouter();
    return (
        <section className="min-h-[100vh] flex items-center justify-center bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col items-center space-y-6 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-medium">   
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient bg-300% inline-block">
                            Effortless. Accurate. Secure.
                        </span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary font-['__Inter_36bd41', '__Inter_Fallback_36bd41', sans-serif]">
                        Your Attendance, Simplified.
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl font-['__Inter_36bd41', '__Inter_Fallback_36bd41', sans-serif]">
                        Streamline your attendance tracking with our intuitive app.
                        Designed for schools, built for efficiency.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 font-['__Inter_36bd41', '__Inter_Fallback_36bd41', sans-serif]">
                        <Button size="lg" className="text-lg px-6 py-4 rounded-full" onClick={() => {
                            router.push('/login');
                        }}>
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg px-6 py-4 rounded-full" onClick={() => {
                            router.push('/docs');
                        }}>
                            Learn More
                            <PlayCircle className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;