import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useContentStore, type Platform, type ContentStatus } from '@/store/content-store';
import { Instagram, Search, Twitter, Youtube, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const platformOptions: { value: Platform; label: string; icon: any; color: string }[] = [
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-50 text-red-600 border-red-200' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-50 text-pink-600 border-pink-200' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'bg-blue-50 text-blue-600 border-blue-200' }
];

const statusOptions: { value: ContentStatus; label: string; color: string }[] = [
  { value: 'idea', label: 'Idea', color: 'bg-gray-50 text-gray-600 border-gray-200' },
  { value: 'scripted', label: 'Scripted', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { value: 'filmed', label: 'Filmed', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { value: 'scheduled', label: 'Scheduled', color: 'bg-green-50 text-green-600 border-green-200' }
];

export function ContentFilters() {
  const {
    searchQuery,
    selectedPlatforms,
    selectedStatuses,
    setSearchQuery,
    setSelectedPlatforms,
    setSelectedStatuses
  } = useContentStore();

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const toggleStatus = (status: ContentStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedPlatforms([]);
    setSelectedStatuses([]);
  };

  const hasActiveFilters = searchQuery || selectedPlatforms.length > 0 || selectedStatuses.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Platforms:</span>
          {platformOptions.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatforms.includes(platform.value);
            
            return (
              <Badge
                key={platform.value}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-105",
                  isSelected ? platform.color : "hover:bg-gray-50"
                )}
                onClick={() => togglePlatform(platform.value)}
              >
                <Icon className="h-3 w-3 mr-1" />
                {platform.label}
              </Badge>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          {statusOptions.map((status) => {
            const isSelected = selectedStatuses.includes(status.value);
            
            return (
              <Badge
                key={status.value}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-105",
                  isSelected ? status.color : "hover:bg-gray-50"
                )}
                onClick={() => toggleStatus(status.value)}
              >
                {status.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}