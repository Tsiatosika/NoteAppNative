import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';   
import { useNotes } from '@/context/NotesContext';
import SearchBar from '@/components/SearchBar';
import TabBar from '@/components/TabBar';
import NoteCard from '@/components/NoteCard';
import { Note } from '@/constants/types';

export default function HomeScreen() {
  const router = useRouter();
  const {
    notes,
    selectedIds,
    isSelecting,
    toggleFavorite,
    deleteSelected,
    toggleSelect,
    addNote,
    startSelecting,
    cancelSelecting,
  } = useNotes();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null); 

  // Fonction pour choisir une image depuis le PC / galerie
  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission requise pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],     
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  // ── Filtrage ──
  const filteredNotes = useMemo(() => {
    let result = notes;
    if (activeTab === 'favorites') result = result.filter(n => n.isFavorite);
    if (search.trim()) {
      result = result.filter(
        n =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [notes, activeTab, search]);

  // ── Grille 2 colonnes ──
  const rows = useMemo(() => {
    const pairs: (Note | null)[][] = [];
    for (let i = 0; i < filteredNotes.length; i += 2) {
      pairs.push([filteredNotes[i], filteredNotes[i + 1] ?? null]);
    }
    return pairs;
  }, [filteredNotes]);

  // ── Handlers ──
  const handleCardPress = (note: Note) => {
    if (isSelecting) {
      toggleSelect(note.id);
    } else {
      router.push({
        pathname: '/modal',
        params: {
          id: note.id,
          title: note.title,
          content: note.content,
          isFavorite: note.isFavorite.toString(),
          createdAt: note.createdAt.toISOString(),
        },
      });
    }
  };

  const handleCardLongPress = (note: Note) => {
    if (!isSelecting) {
      startSelecting();
      toggleSelect(note.id);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* ── HEADER ── */}
        {isSelecting ? (
          <View style={styles.header}>
            <TouchableOpacity onPress={cancelSelecting}>
              <Ionicons name="arrow-back" size={22} color="#111" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {selectedIds.length} Selected
            </Text>
            <TouchableOpacity onPress={deleteSelected}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.header}>

            <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarWrapper}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person-outline" size={18} color="#999" />
                </View>
              )}

              <View style={styles.avatarBadge}>
                <Ionicons name="pencil" size={8} color="#fff" />
              </View>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>My Notes</Text>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name="ellipsis-vertical" size={20} color="#111" />
            </TouchableOpacity>
          </View>
        )}

        <SearchBar value={search} onChangeText={setSearch} />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <FlatList
          data={rows}
          keyExtractor={(_, i) => i.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item: row }) => (
            <View style={styles.row}>
              {row.map((note, idx) =>
                note ? (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isSelecting={isSelecting}
                    isSelected={selectedIds.includes(note.id)}
                    onPress={() => handleCardPress(note)}
                    onLongPress={() => handleCardLongPress(note)}
                    onToggleFavorite={() => toggleFavorite(note.id)}
                  />
                ) : (
                  <View key={`empty-${idx}`} style={styles.emptyCell} />
                )
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="document-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No notes found</Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/modal')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => { setMenuVisible(false); startSelecting(); }}
              >
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setMenuVisible(false)}
              >
                <Text style={styles.menuText}>View</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  deleteBtn: { fontSize: 15, fontWeight: '600', color: '#EF4444' },

  avatarWrapper: {
    position: 'relative',
    width: 36,
    height: 36,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },

  // List
  list: { paddingTop: 8, paddingBottom: 100 },
  row: { flexDirection: 'row', marginBottom: 8 },
  emptyCell: { flex: 1, margin: 4 },
  empty: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: '#ccc' },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  // Menu
  overlay: { flex: 1 },
  menu: {
    position: 'absolute',
    top: 90,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    minWidth: 130,
    overflow: 'hidden',
  },
  menuItem: { paddingVertical: 14, paddingHorizontal: 20 },
  menuText: { fontSize: 15, color: '#111' },
  menuDivider: { height: 1, backgroundColor: '#F2F2F7' },
});