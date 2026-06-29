import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { imageToBase64 } from '../lib/gemini';

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams();
  const router = useRouter();

  async function handleAnalyze(promptKey) {
    const base64Image = await imageToBase64(photoUri);
    router.push({ pathname: '/ResultScreen', params: { base64Image, promptKey } });
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="contain" />

      <View style={styles.personaRow}>
        <TouchableOpacity style={styles.personaButton} onPress={() => handleAnalyze('academic')}>
          <Text style={styles.personaButtonText}>Academic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.personaButton} onPress={() => handleAnalyze('safety')}>
          <Text style={styles.personaButtonText}>Safety</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.personaButton} onPress={() => handleAnalyze('inventory')}>
          <Text style={styles.personaButtonText}>Inventory</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.retakeButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  preview: { flex: 1 },
  personaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  personaButton: {
    backgroundColor: '#5B3FA3',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
  },
  personaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  actionRow: { flexDirection: 'row', justifyContent: 'center', padding: 20 },
  retakeButton: { backgroundColor: '#5A6472', padding: 14, borderRadius: 8, minWidth: 140 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});