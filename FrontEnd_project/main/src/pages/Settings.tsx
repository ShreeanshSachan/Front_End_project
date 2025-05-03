
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sun, Moon, Trash, FileJson } from 'lucide-react';

interface ColorOption {
  name: string;
  value: string;
}

const colorOptions: ColorOption[] = [
  { name: 'Yellow', value: 'yellow' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Pink', value: 'pink' },
  { name: 'Purple', value: 'purple' },
  { name: 'Peach', value: 'peach' },
  { name: 'Gray', value: 'gray' },
];

const Settings = () => {
  const { getUserSettings, updateUserSettings, getUserNotes, deleteAllNotes, currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const settings = getUserSettings();
  const [defaultColor, setDefaultColor] = useState(settings.defaultColor);
  
  const handleColorChange = (color: string) => {
    setDefaultColor(color);
    updateUserSettings({ defaultColor: color });
  };
  
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme();
    updateUserSettings({ theme: newTheme });
  };
  
  const exportNotes = () => {
    const notes = getUserNotes();
    const exportData = {
      username: currentUser,
      exportDate: new Date().toISOString(),
      notes: notes,
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sticky-notes-export-${new Date().toLocaleDateString('en-US').replace(/\//g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    linkElement.remove();
    
    toast.success('Notes exported successfully');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how Sticky Notes looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {theme === 'light' ? <Sun className="text-amber-500" /> : <Moon className="text-indigo-300" />}
                  <div>
                    <p className="font-medium">{theme === 'light' ? 'Light' : 'Dark'} Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Note Color Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Default Note Color</CardTitle>
              <CardDescription>Choose the default color for new notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={`w-10 h-10 rounded-md note-${color.value} ${
                      defaultColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    onClick={() => handleColorChange(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export or delete your notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileJson className="text-blue-500" />
                  <div>
                    <p className="font-medium">Export Notes</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Download all your notes as a JSON file
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={exportNotes}>
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Trash className="text-red-500" />
                  <div>
                    <p className="font-medium">Delete All Notes</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Permanently delete all your notes
                    </p>
                  </div>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete All</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your notes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteAllNotes}>
                        Delete All Notes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;