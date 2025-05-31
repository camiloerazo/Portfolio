import { mockExperience } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto">
        <h2 className="text-3xl font-headline font-bold text-center mb-12 sm:text-4xl">Professional History</h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          {mockExperience.map((exp) => (
            <Card key={exp.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                    <CardTitle className="font-headline text-xl">{exp.role}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                        {exp.startDate} - {exp.endDate || 'Present'}
                    </Badge>
                </div>
                <CardDescription className="text-md">
                  <a 
                    href={exp.companyUrl || '#'} 
                    target={exp.companyUrl ? "_blank" : "_self"} 
                    rel={exp.companyUrl ? "noopener noreferrer" : ""}
                    className="text-primary hover:underline"
                  >
                    {exp.company}
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
                  {exp.description.map((desc, index) => (
                    <li key={index}>{desc}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <Badge key={skill} variant="default" className="text-xs bg-accent text-accent-foreground hover:bg-accent/80">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
