
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Settings, LogOut } from 'lucide-react';

const Header = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b py-3">
      <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          Sticky Notes
        </Link>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            asChild
            title="Settings"
          >
            <Link to="/settings">
              <Settings size={20} />
            </Link>
          </Button>
          
          <Button
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;