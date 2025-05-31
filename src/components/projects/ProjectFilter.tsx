'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProjectFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export default function ProjectFilter({ tags, selectedTag, onSelectTag }: ProjectFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2 items-center">
      <span className="mr-2 font-medium text-sm">Filter by tag:</span>
      <Button
        variant={selectedTag === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelectTag(null)}
        className="text-xs rounded-full px-3 py-1 h-auto"
      >
        All
      </Button>
      {tags.map((tag) => (
        <Button
          key={tag}
          variant={selectedTag === tag ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectTag(tag)}
          className="text-xs rounded-full px-3 py-1 h-auto"
        >
          {tag}
        </Button>
      ))}
    </div>
  );
}
