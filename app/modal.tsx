// app/modal.tsx
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '@/context/NotesContext';

export default function NoteModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    content?: string;
    isFavorite?: string;
    createdAt?: string;
  }>();

  // ✅ Guard : si le contexte n'est pas disponible (bug web Expo),
  // on recharge la page pour forcer le bon arbre React
  let notesContext;
  try {
    notesContext = useNotes();
  } catch {
    return null; // ou un spinner le temps que le contexte se monte
  }

  const { addNote, updateNote, deleteNote, toggleFavorite } = notesContext;

  const isEditing = !!params.id;
  const [title, setTitle] = useState(params.title ?? '');
  const [content, setContent] = useState(params.content ?? '');
  const [isFavorite, setIsFavorite] = useState(params.isFavorite === 'true');
  const createdAt = params.createdAt ? new Date(params.createdAt) : new Date();

  const contentRef = useRef<TextInput>(null);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a title for your note.');
      return;
    }
    if (isEditing && params.id) {
      updateNote(params.id, title.trim(), content.trim());
    } else {
      addNote(title.trim(), content.trim());
    }
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (params.id) deleteNote(params.id);
          router.back();
        },
      },
    ]);
  };

  const handleDiscard = () => {
    const hasChanges =
      title.trim() !== (params.title ?? '') ||
      content.trim() !== (params.content ?? '');
    if (hasChanges) {
      Alert.alert('Discard changes?', 'Your changes will not be saved.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  };

  const handleToggleFavorite = () => {
    if (params.id) {
      toggleFavorite(params.id);
      setIsFavorite(prev => !prev);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleDiscard} style={styles.headerBtn}>
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Note' : 'New Note'}
          </Text>

          <View style={styles.headerRight}>
            {isEditing && (
              <TouchableOpacity onPress={handleToggleFavorite} style={styles.headerBtn}>
                <Ionicons
                  name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color="#4F46E5"
                />
              </TouchableOpacity>
            )}
            {isEditing && (
              <TouchableOpacity onPress={handleDelete} style={styles.headerBtn}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.headerBtn, styles.saveBtn]}
            >
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#ccc"
            value={title}
            onChangeText={setTitle}
            maxLength={60}
            returnKeyType="next"
            onSubmitEditing={() => contentRef.current?.focus()}
          />
          <View style={styles.divider} />
          <Text style={styles.dateLabel}>
            {createdAt.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <TextInput
            ref={contentRef}
            style={styles.contentInput}
            placeholder="Write your note here..."
            placeholderTextColor="#ccc"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* TOOLBAR */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Ionicons name="text" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Ionicons name="list-outline" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Ionicons name="image-outline" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Ionicons name="mic-outline" size={18} color="#666" />
          </TouchableOpacity>
          <View style={styles.toolbarSpacer} />
          <Text style={styles.charCount}>{content.length} chars</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2F2F7',
  },
  headerBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  saveBtn: {
    backgroundColor: '#4F46E5', paddingHorizontal: 16,
    paddingVertical: 7, borderRadius: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  form: { flex: 1, padding: 20 },
  titleInput: { fontSize: 22, fontWeight: '700', color: '#111', paddingVertical: 8 },
  divider: { height: 1, backgroundColor: '#F2F2F7', marginVertical: 12 },
  dateLabel: { fontSize: 12, color: '#aaa', marginBottom: 16 },
  contentInput: { flex: 1, fontSize: 15, color: '#333', lineHeight: 24 },
  toolbar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#F2F2F7', backgroundColor: '#fff',
  },
  toolbarBtn: { padding: 8, marginHorizontal: 4 },
  toolbarSpacer: { flex: 1 },
  charCount: { fontSize: 12, color: '#ccc' },
});