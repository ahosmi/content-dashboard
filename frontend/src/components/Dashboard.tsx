import { Button } from '@/components/ui/button';
import { useContentStore } from '@/store/content-store';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ContentCard } from './ContentCard';
import { ContentFilters } from './ContentFilters';
import { ContentModal } from './ContentModal';
import type { Content } from '@/store/content-store';

export function Dashboard() {
  const { getFilteredContents } = useContentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  
  const filteredContents = getFilteredContents();

  const handleEditContent = (content: Content) => {
    setEditingContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContent(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your content across all platforms</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Content
        </Button>
      </div>

      <div className="mb-6">
        <ContentFilters />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContents.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            onEdit={handleEditContent}
          />
        ))}
      </div>

      {filteredContents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="h-12 w-12 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first piece of content
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            Create Content
          </Button>
        </div>
      )}

      <ContentModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        content={editingContent}
      />
    </div>
  );
}