
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

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

const CreateNoteForm = () => {
  const { addNote, getUserSettings } = useAuth();
  const settings = getUserSettings();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(settings.defaultColor);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }
    
    addNote({
      title,
      content,
      color,
    });
    
    // Reset form
    setTitle('');
    setContent('');
    setColor(settings.defaultColor);
    setIsExpanded(false);
    
    toast.success('Note created successfully');
  };
  
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        {isExpanded && (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title (optional)"
            className="mb-2"
          />
        )}
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Take a note..."
          className="mb-3 resize-none"
          rows={isExpanded ? 3 : 1}
          onFocus={() => setIsExpanded(true)}
        />
        
        {isExpanded && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="text-sm mr-2">Color:</div>
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`w-6 h-6 rounded-full note-${option.value} ${
                    color === option.value ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  onClick={() => setColor(option.value)}
                  title={option.name}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
              
              <Button type="submit">
                <Plus size={16} className="mr-1" />
                Add Note
              </Button>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};

export default CreateNoteForm;