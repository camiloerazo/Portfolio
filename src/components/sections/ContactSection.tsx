import { socialLinks } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Phone, Mail } from 'lucide-react'; // Changed Twitter to Phone

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-headline font-bold mb-4 sm:text-4xl">Get In Touch</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline" size="lg">
            <a href={`mailto:juancamiloerazo82@gmail.com`} aria-label="Email">
              <Mail className="mr-2 h-5 w-5" /> Email Me
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="hover:bg-primary/10 hover:text-primary">
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="hover:bg-primary/10 hover:text-primary">
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="mr-2 h-5 w-5" /> GitHub
            </a>
          </Button>
          {socialLinks.phoneNumber && (
             <Button asChild variant="outline" size="lg" className="hover:bg-primary/10 hover:text-primary">
                <a href={`tel:${socialLinks.phoneNumber}`} aria-label="Phone Number">
                <Phone className="mr-2 h-5 w-5" /> Call Me
                </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
