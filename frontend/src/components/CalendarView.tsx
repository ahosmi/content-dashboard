import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContentStore, type Content } from '@/store/content-store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Instagram, Plus, Twitter, Youtube } from 'lucide-react';
import { useState } from 'react';
import { ContentModal } from './ContentModal';
import { cn } from '@/lib/utils';

const platformIcons = {
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter
};

const platformColors = {
  youtube: 'bg-red-500',
  instagram: 'bg-pink-500',
  twitter: 'bg-blue-500'
};

export function CalendarView() {
  const { contents, getContentsByDate } = useContentStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const getContentForDate = (date: Date) => {
    return contents.filter(content => 
      isSameDay(new Date(content.plannedDate), date)
    );
  };

  const selectedDateContents = selectedDate ? getContentForDate(selectedDate) : [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600 mt-1">View and schedule your content</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Content
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {format(currentDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const dayContents = getContentForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className={cn(
                        'min-h-[80px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200',
                        'hover:border-gray-300 hover:shadow-sm',
                        !isCurrentMonth && 'bg-gray-50 text-gray-400',
                        isSelected && 'border-purple-300 bg-purple-50',
                        isToday && 'border-blue-300 bg-blue-50'
                      )}
                    >
                      <div className="text-sm font-medium mb-1">
                        {format(day, 'd')}
                      </div>
                      
                      <div className="space-y-1">
                        {dayContents.slice(0, 2).map((content) => {
                          const Icon = platformIcons[content.platform];
                          return (
                            <div
                              key={content.id}
                              className="flex items-center gap-1 text-xs p-1 rounded bg-white border"
                            >
                              <div className={cn('w-2 h-2 rounded-full', platformColors[content.platform])} />
                              <span className="truncate flex-1">{content.title}</span>
                            </div>
                          );
                        })}
                        {dayContents.length > 2 && (
                          <div className="text-xs text-gray-500 pl-1">
                            +{dayContents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedDateContents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateContents.map((content) => {
                      const Icon = platformIcons[content.platform];
                      return (
                        <div
                          key={content.id}
                          className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={cn('w-6 h-6 rounded flex items-center justify-center', platformColors[content.platform])}>
                              <Icon className="w-3 h-3 text-white" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {content.status}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{content.title}</h4>
                          {content.notes && (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {content.notes.replace(/[#*`]/g, '').trim()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <Plus className="h-8 w-8 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      No content scheduled for this date
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full"
                    >
                      Add Content
                    </Button>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600">
                    Click on a date to view scheduled content
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ContentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}