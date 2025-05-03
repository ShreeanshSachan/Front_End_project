
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface User {
  username: string;
  password: string;
  notes: Note[];
  settings: UserSettings;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
}

export interface UserSettings {
  defaultColor: string;
  theme: 'light' | 'dark';
}

interface AuthContextType {
  currentUser: string | null;
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
  getUserNotes: () => Note[];
  getUserSettings: () => UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  deleteAllNotes: () => void;
}

const defaultSettings: UserSettings = {
  defaultColor: 'yellow',
  theme: 'light',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Load current user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const getUsers = (): Record<string, User> => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : {};
  };

  const saveUsers = (users: Record<string, User>) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const login = (username: string, password: string): boolean => {
    const users = getUsers();
    
    if (!users[username]) {
      toast.error('User not found');
      return false;
    }
    
    if (users[username].password !== password) {
      toast.error('Incorrect password');
      return false;
    }
    
    localStorage.setItem('currentUser', username);
    setCurrentUser(username);
    toast.success('Logged in successfully');
    return true;
  };

  const signup = (username: string, password: string): boolean => {
    const users = getUsers();
    
    if (users[username]) {
      toast.error('Username already taken');
      return false;
    }
    
    const newUser: User = {
      username,
      password,
      notes: [],
      settings: { ...defaultSettings },
    };
    
    users[username] = newUser;
    saveUsers(users);
    
    localStorage.setItem('currentUser', username);
    setCurrentUser(username);
    toast.success('Account created successfully');
    return true;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  const getUserNotes = (): Note[] => {
    if (!currentUser) return [];
    
    const users = getUsers();
    return users[currentUser]?.notes || [];
  };

  const getUserSettings = (): UserSettings => {
    if (!currentUser) return { ...defaultSettings };
    
    const users = getUsers();
    return users[currentUser]?.settings || { ...defaultSettings };
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    if (!currentUser) return;
    
    const users = getUsers();
    
    if (!users[currentUser]) return;
    
    users[currentUser].settings = {
      ...users[currentUser].settings,
      ...settings,
    };
    
    saveUsers(users);
    toast.success('Settings updated');
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    
    const users = getUsers();
    
    if (!users[currentUser]) return;
    
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    users[currentUser].notes = [newNote, ...users[currentUser].notes];
    saveUsers(users);
  };

  const updateNote = (note: Note) => {
    if (!currentUser) return;
    
    const users = getUsers();
    
    if (!users[currentUser]) return;
    
    const noteIndex = users[currentUser].notes.findIndex(n => n.id === note.id);
    
    if (noteIndex === -1) return;
    
    users[currentUser].notes[noteIndex] = note;
    saveUsers(users);
  };

  const deleteNote = (id: string) => {
    if (!currentUser) return;
    
    const users = getUsers();
    
    if (!users[currentUser]) return;
    
    users[currentUser].notes = users[currentUser].notes.filter(note => note.id !== id);
    saveUsers(users);
    toast.success('Note deleted');
  };

  const deleteAllNotes = () => {
    if (!currentUser) return;
    
    const users = getUsers();
    
    if (!users[currentUser]) return;
    
    users[currentUser].notes = [];
    saveUsers(users);
    toast.success('All notes deleted');
  };

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    logout,
    getUserNotes,
    getUserSettings,
    updateUserSettings,
    addNote,
    updateNote,
    deleteNote,
    deleteAllNotes,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}