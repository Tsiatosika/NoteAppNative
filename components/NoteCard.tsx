import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '@/constants/types';

interface Props {
  note: Note;
  isSelecting: boolean;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onToggleFavorite: () => void;
}

function formatDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours || 1} hour ago`;
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function NoteCard({
  note,
  isSelecting,
  isSelected,
  onPress,
  onLongPress,
  onToggleFavorite,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selected]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
        <TouchableOpacity onPress={onToggleFavorite} hitSlop={8}>
          <Ionicons
            name={note.isFavorite ? 'bookmark' : 'bookmark-outline'}
            size={16}
            color={note.isFavorite ? '#4F46E5' : '#ccc'}
          />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {note.title}
      </Text>

      {/* Content */}
      <Text style={styles.content} numberOfLines={5}>
        {note.content}
      </Text>

      {/* Selection indicator */}
      {isSelecting && (
        <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]}>
          {isSelected && (
            <Ionicons name="checkmark" size={12} color="#fff" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    margin: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  date: {
    fontSize: 10,
    color: '#999',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  content: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },
  checkCircle: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4F46E5',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#4F46E5',
  },
});