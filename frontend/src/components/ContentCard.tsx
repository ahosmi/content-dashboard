import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useContentStore, type Content, type Platform, type ContentStatus } from '@/store/content-store';
import { format } from 'date-fns';
import { Edit2, Instagram, MoreHorizontal, Trash2, Twitter, Youtube } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const platformConfig = {
  youtube: {
    icon: Youtube,
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  instagram: {
    icon: Instagram,
    color: 'bg-pink-500',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  twitter: {
    icon: Twitter,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }
} as const;

const statusConfig = {
  idea: {
    label: 'Idea',
    color: 'bg-gray-100 text-gray-700',
    dotColor: 'bg-gray-400'
  },
  scripted: {
    label: 'Scripted',
    color: 'bg-yellow-100 text-yellow-800',
    dotColor: 'bg-yellow-500'
  },
  filmed: {
    label: 'Filmed',
    color: 'bg-blue-100 text-blue-800',
    dotColor: 'bg-blue-500'
  },
  scheduled: {
    label: 'Scheduled',
    color: 'bg-green-100 text-green-800',
    dotColor: 'bg-green-500'
  }
} as const;

interface ContentCardProps {
  content: Content;
  onEdit?: (content: Content) => void;
}

export function ContentCard({ content, onEdit }: ContentCardProps) {
  const { deleteContent } = useContentStore();
  const platform = platformConfig[content.platform];
  const status = statusConfig[content.status];
  const PlatformIcon = platform.icon;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteContent(content.id);
    }
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', platform.color)}>
              <PlatformIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <div className={cn('w-2 h-2 rounded-full', status.dotColor)} />
              <Badge variant="secondary" className={cn('text-xs font-medium', status.color)}>
                {status.label}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(content)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {content.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>Planned for {format(content.plannedDate, 'MMM d, yyyy')}</span>
        </div>

        {content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {content.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {content.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{content.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {content.notes && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {content.notes.replace(/[#*`]/g, '').trim()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}