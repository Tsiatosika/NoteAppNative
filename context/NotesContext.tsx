import { Note } from '@/constants/types';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Réviser Java Swing',
    content:
        'Revoir les composants : JButton, JLabel \nPratiquer la gestion des événements (ActionListener)',
    createdAt: new Date(),
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Avancer projet e-commerce PHP',
    content:
        ' Créer la page de connexion utilisateur (login) \n Implémenter les sessions PHP',
    createdAt: new Date('2022-06-20'),
    isFavorite: true,
  },
];

// ── Types ──
interface NotesContextType {
  notes: Note[];
  selectedIds: string[];
  isSelecting: boolean;
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  deleteSelected: () => void;
  toggleFavorite: (id: string) => void;
  toggleSelect: (id: string) => void;
  startSelecting: () => void;
  cancelSelecting: () => void;
}

// ── Context ──
const NotesContext = createContext<NotesContextType | null>(null);

// ── Provider ──
export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // CREATE
  const addNote = useCallback((title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      isFavorite: false,
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  // UPDATE
  const updateNote = useCallback(
    (id: string, title: string, content: string) => {
      setNotes(prev =>
        prev.map(n => (n.id === id ? { ...n, title, content } : n))
      );
    },
    []
  );

  // DELETE one
  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  // DELETE selected
  const deleteSelected = useCallback(() => {
    setNotes(prev => prev.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    setIsSelecting(false);
  }, [selectedIds]);

  // FAVORITE toggle
  const toggleFavorite = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  }, []);

  // SELECTION
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const startSelecting = useCallback(() => {
    setIsSelecting(true);
    setSelectedIds([]);
  }, []);

  const cancelSelecting = useCallback(() => {
    setIsSelecting(false);
    setSelectedIds([]);
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        selectedIds,
        isSelecting,
        addNote,
        updateNote,
        deleteNote,
        deleteSelected,
        toggleFavorite,
        toggleSelect,
        startSelecting,
        cancelSelecting,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

// ── Hook ──
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used inside NotesProvider');
  return ctx;
}