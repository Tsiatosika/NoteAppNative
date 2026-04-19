import { Stack } from 'expo-router';
import { NotesProvider } from '@/context/NotesContext';

export default function RootLayout() {
  return (
    <NotesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </NotesProvider>
  );
}