import { cn } from '@/lib/utils';
import { useContentStore } from '@/store/content-store';
import { useAuthStore } from '@/store/auth-store';
import { Calendar, LayoutDashboard, Sparkles, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigationItems = [
  {
    id: 'dashboard' as const,
    label: 'All Content',
    icon: LayoutDashboard
  },
  {
    id: 'calendar' as const,
    label: 'Calendar',
    icon: Calendar
  },
  {
    id: 'ai-lab' as const,
    label: 'AI Lab',
    icon: Sparkles
  }
];

export function Sidebar() {
  const { currentView, setCurrentView } = useContentStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Content Planner</h1>
            <p className="text-xs text-gray-500">Creator Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-purple-200 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-purple-600' : 'text-gray-400')} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2 h-auto group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user ? getInitials(user.name) : 'U'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white group-hover:text-black transition-colors">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">Creator</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
