import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useContentStore, type Content, type Platform, type ContentStatus } from '@/store/content-store';
import { Calendar, Instagram, Plus, Twitter, X, Youtube } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content?: Content | null;
}

const platformOptions = [
  { value: 'youtube' as Platform, label: 'YouTube', icon: Youtube },
  { value: 'instagram' as Platform, label: 'Instagram', icon: Instagram },
  { value: 'twitter' as Platform, label: 'Twitter', icon: Twitter }
];

const statusOptions = [
  { value: 'idea' as ContentStatus, label: 'Idea' },
  { value: 'scripted' as ContentStatus, label: 'Scripted' },
  { value: 'filmed' as ContentStatus, label: 'Filmed' },
  { value: 'scheduled' as ContentStatus, label: 'Scheduled' }
];

export function ContentModal({ open, onOpenChange, content }: ContentModalProps) {
  const { addContent, updateContent } = useContentStore();
  
  const [formData, setFormData] = useState({
    title: '',
    platform: 'youtube' as Platform,
    status: 'idea' as ContentStatus,
    plannedDate: new Date(),
    tags: [] as string[],
    notes: ''
  });
  
  const [newTag, setNewTag] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        platform: content.platform,
        status: content.status,
        plannedDate: new Date(content.plannedDate),
        tags: [...content.tags],
        notes: content.notes
      });
    } else {
      setFormData({
        title: '',
        platform: 'youtube',
        status: 'idea',
        plannedDate: new Date(),
        tags: [],
        notes: ''
      });
    }
  }, [content, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content) {
      updateContent(content.id, formData);
    } else {
      addContent(formData);
    }
    
    onOpenChange(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {content ? 'Edit Content' : 'Create New Content'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter content title..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value: Platform) => 
                  setFormData(prev => ({ ...prev, platform: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <SelectItem key={platform.value} value={platform.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {platform.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ContentStatus) => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Planned Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.plannedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.plannedDate ? format(formData.plannedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={formData.plannedDate}
                  onSelect={(date) => {
                    if (date) {
                      setFormData(prev => ({ ...prev, plannedDate: date }));
                      setCalendarOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
              />
              <Button type="button" onClick={addTag} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes & Script</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add notes, script outline, or ideas..."
              rows={6}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {content ? 'Update' : 'Create'} Content
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}