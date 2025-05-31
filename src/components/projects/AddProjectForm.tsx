'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox'; // Added Checkbox
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generateProjectSummary, type GenerateProjectSummaryInput } from '@/ai/flows/generate-project-summary';
import type { Project } from '@/lib/types';
import { Loader2, Wand2, PlusCircle, Star } from 'lucide-react'; // Added Star icon

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  repoUrl: z.string().url('Must be a valid GitHub URL').min(1, 'GitHub repo URL is required'),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  summary: z.string().min(10, 'Summary must be at least 10 characters').optional().or(z.literal('')),
  tags: z.string().min(1, 'At least one tag is required'),
  isFeatured: z.boolean().default(false).optional(), // Added isFeatured
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface AddProjectFormProps {
  onAddProject: (project: Project) => void;
}

export default function AddProjectForm({ onAddProject }: AddProjectFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      isFeatured: true, // Default new projects to be featured
    },
  });

  const repoUrlValue = watch('repoUrl');

  const handleGenerateSummary = async () => {
    if (!repoUrlValue || !repoUrlValue.startsWith('https://github.com/')) {
      toast({
        title: 'Invalid GitHub URL',
        description: 'Please enter a valid GitHub repository URL to generate a summary.',
        variant: 'destructive',
      });
      return;
    }
    setIsGeneratingSummary(true);
    try {
      const input: GenerateProjectSummaryInput = { repoUrl: repoUrlValue };
      const result = await generateProjectSummary(input);
      setValue('summary', result.summary);
      toast({
        title: 'Summary Generated',
        description: 'AI-powered summary has been populated.',
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error Generating Summary',
        description: 'Could not generate summary. Please try again or enter manually.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const onSubmit: SubmitHandler<ProjectFormData> = (data) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: data.name,
      repoUrl: data.repoUrl,
      liveUrl: data.liveUrl || undefined,
      summary: data.summary || 'Summary not provided.',
      tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      imageUrl: `https://placehold.co/600x400.png`,
      isFeatured: data.isFeatured,
    };
    onAddProject(newProject);
    toast({
      title: 'Project Added',
      description: `${data.name} has been successfully added.`,
    });
    setIsOpen(false);
    // Consider resetting form here if needed: reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-8">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="repoUrl">GitHub Repo URL</Label>
            <Input id="repoUrl" {...register('repoUrl')} placeholder="https://github.com/username/repository" />
            {errors.repoUrl && <p className="text-sm text-destructive mt-1">{errors.repoUrl.message}</p>}
          </div>

          <div>
            <Label htmlFor="liveUrl">Live Demo URL (Optional)</Label>
            <Input id="liveUrl" {...register('liveUrl')} placeholder="https://example.com" />
            {errors.liveUrl && <p className="text-sm text-destructive mt-1">{errors.liveUrl.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="summary">Project Summary</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleGenerateSummary} disabled={isGeneratingSummary || !repoUrlValue}>
                {isGeneratingSummary ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate with AI
              </Button>
            </div>
            <Textarea id="summary" {...register('summary')} rows={4} placeholder="A brief description of your project." />
            {errors.summary && <p className="text-sm text-destructive mt-1">{errors.summary.message}</p>}
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" {...register('tags')} placeholder="e.g., React, Node.js, AI" />
            {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="isFeatured" {...register('isFeatured')} defaultChecked={true} />
            <Label htmlFor="isFeatured" className="font-normal flex items-center">
              <Star className="mr-2 h-4 w-4 text-yellow-400 fill-yellow-400" /> Feature this project on the main page
            </Label>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
