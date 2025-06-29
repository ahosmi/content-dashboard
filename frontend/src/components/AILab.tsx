import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useContentStore, type Platform, type AIGeneration } from '@/store/content-store';
import { Bot, Copy, Instagram, Lightbulb, Sparkles, Twitter, Youtube } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const platformOptions = [
  { value: 'youtube' as Platform, label: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { value: 'instagram' as Platform, label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { value: 'twitter' as Platform, label: 'Twitter', icon: Twitter, color: 'text-blue-600' }
];

// Mock AI suggestions - in a real app, this would call an API
const generateMockSuggestions = (topic: string, platform: Platform): string[] => {
  const suggestions = {
    youtube: [
      `The Complete Guide to ${topic}: Everything You Need to Know`,
      `${topic} Explained in 10 Minutes (Beginner Friendly)`,
      `Why Everyone Should Learn ${topic} in 2024`,
      `${topic} vs Alternatives: Which Should You Choose?`,
      `I Spent 30 Days Learning ${topic} - Here's What Happened`
    ],
    instagram: [
      `${topic} tips that changed my life ✨`,
      `POV: You finally understand ${topic}`,
      `${topic} mistakes I wish I knew earlier`,
      `Day in the life using ${topic}`,
      `${topic} hacks that actually work 🔥`
    ],
    twitter: [
      `${topic} is overrated. Here's why:`,
      `Unpopular opinion: ${topic} isn't as hard as everyone says`,
      `${topic} in 2024: A thread 🧵`,
      `Things I wish I knew before starting with ${topic}`,
      `Hot take: ${topic} is the future of tech`
    ]
  };

  return suggestions[platform] || [];
};

export function AILab() {
  const { addAIGeneration, aiGenerations } = useContentStore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'youtube' as Platform,
    context: ''
  });

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to generate suggestions.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const suggestions = generateMockSuggestions(formData.topic, formData.platform);
    
    addAIGeneration({
      topic: formData.topic,
      platform: formData.platform,
      suggestions
    });

    setIsGenerating(false);
    
    toast({
      title: "Suggestions generated!",
      description: `Generated ${suggestions.length} suggestions for ${formData.platform}.`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  const createContentFromSuggestion = (suggestion: string, platform: Platform) => {
    // This would typically navigate to the content creation form
    // For now, we'll just show a toast
    toast({
      title: "Content created",
      description: `Added "${suggestion}" to your content list.`,
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Lab</h1>
          <p className="text-gray-600 mt-1">Generate engaging titles and captions with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Generate Content Ideas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Keyword</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g., React, photography, productivity..."
                  className="w-full"
                />
              </div>

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
                            <Icon className={`h-4 w-4 ${platform.color}`} />
                            {platform.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">Additional Context (Optional)</Label>
                <Textarea
                  id="context"
                  value={formData.context}
                  onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                  placeholder="Provide additional context, target audience, or specific requirements..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Suggestions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Suggestions */}
        <div className="space-y-6">
          {aiGenerations.map((generation) => (
            <Card key={generation.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    {generation.topic}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const platform = platformOptions.find(p => p.value === generation.platform);
                      if (platform) {
                        const Icon = platform.icon;
                        return (
                          <Badge variant="outline" className="gap-1">
                            <Icon className={`h-3 w-3 ${platform.color}`} />
                            {platform.label}
                          </Badge>
                        );
                      }
                      return null;
                    })()}
                    <span className="text-xs text-gray-500">
                      {format(generation.createdAt, 'MMM d, HH:mm')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generation.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="group p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-gray-800 flex-1">
                          {suggestion}
                        </p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(suggestion)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => createContentFromSuggestion(suggestion, generation.platform)}
                            className="h-8 w-8 p-0"
                          >
                            <Sparkles className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {aiGenerations.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Bot className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions yet</h3>
                <p className="text-gray-600">
                  Enter a topic and platform to generate AI-powered content suggestions
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}