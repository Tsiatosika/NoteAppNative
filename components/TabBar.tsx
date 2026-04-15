import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  activeTab: 'all' | 'favorites';
  onTabChange: (tab: 'all' | 'favorites') => void;
}

export default function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onTabChange('all')} style={styles.tab}>
        <Text style={[styles.label, activeTab === 'all' && styles.inactive]}>
          All Notes
        </Text>
        {activeTab === 'all' && <View style={styles.underline} />}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onTabChange('favorites')} style={styles.tab}>
        <Text style={[styles.label, activeTab === 'favorites' && styles.active]}>
          Favorites
        </Text>
        {activeTab === 'favorites' && <View style={styles.underline} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#999',
  },
  active: {
    color: '#111',
    fontWeight: '700',
  },
  inactive: {
    color: '#999',
    fontWeight: '400',
  },
  underline: {
    marginTop: 6,
    height: 2,
    width: '40%',
    backgroundColor: '#4F46E5',
    borderRadius: 2,
  },
});