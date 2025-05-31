import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Hello, I&apos;m <span className="text-primary">Your Name</span>.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground sm:text-xl">
          I&apos;m a passionate software developer specializing in creating modern, responsive, and user-friendly web applications. Welcome to my personal portfolio where I showcase my projects and professional journey.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="#projects">
              View My Projects
              <ArrowDown className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#contact">
              Get In Touch
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
