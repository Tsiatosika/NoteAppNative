import { Note } from '@/constants/types';
import { useCallback, useState } from 'react';

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Math Notes',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Malesuada sodales sed et, adipiscing auctor. Et est ipsum et tortor. sodales sed et, adipiscing auctor. Et est ipsum et tortor.',
    createdAt: new Date(),
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Project Ideas',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Malesuada sodales sed et, adipiscing auctor. Et est ipsum et tortor.',
    createdAt: new Date('2022-06-20'),
    isFavorite: true,
  },
];

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const toggleFavorite = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)
    );
  }, []);

  const deleteSelected = useCallback(() => {
    setNotes(prev => prev.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    setIsSelecting(false);
  }, [selectedIds]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

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

  const startSelecting = useCallback(() => {
    setIsSelecting(true);
    setSelectedIds([]);
  }, []);

  const cancelSelecting = useCallback(() => {
    setIsSelecting(false);
    setSelectedIds([]);
  }, []);

  const updateNote = useCallback((id: string, title: string, content: string) => {
  setNotes(prev =>
    prev.map(n => n.id === id ? { ...n, title, content } : n)
  );
}, []);

  return {
    notes,
    selectedIds,
    isSelecting,
    toggleFavorite,
    deleteSelected,
    toggleSelect,
    addNote,
    startSelecting,
    cancelSelecting,
    updateNote,
  };
}