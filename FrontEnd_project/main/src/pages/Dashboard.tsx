
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import NoteCard from '@/components/NoteCard';
import CreateNoteForm from '@/components/CreateNoteForm';
import { Input } from '@/components/ui/input';
import { Note } from '@/contexts/AuthContext';
import { Search } from 'lucide-react';

const Dashboard = () => {
  const { getUserNotes, updateNote, deleteNote } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load notes from context
  useEffect(() => {
    const fetchNotes = () => {
      const userNotes = getUserNotes();
      setNotes(userNotes);
    };
    
    fetchNotes();
    
    // Set up polling to check for changes
    const interval = setInterval(fetchNotes, 1000);
    return () => clearInterval(interval);
  }, [getUserNotes]);
  
  const handleUpdateNote = (updatedNote: Note) => {
    updateNote(updatedNote);
    
    // Update local state for immediate UI update
    setNotes(prevNotes =>
      prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note)
    );
  };
  
  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    
    // Update local state for immediate UI update
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };
  
  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container max-w-5xl mx-auto px-4 py-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <CreateNoteForm />
        
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No notes match your search' : 'No notes yet. Create your first note above!'}
            </p>
          </div>
        ) : (
          <div className="note-container">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;