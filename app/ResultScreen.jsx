import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { analyzeImage, PROMPTS } from '../lib/gemini';

export default function ResultScreen() {
  const { base64Image, promptKey } = useLocalSearchParams();
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function analyze() {
      try {
        const prompt = PROMPTS[promptKey] || PROMPTS.academic;
        const response = await analyzeImage(base64Image, prompt);
        console.log('Gemini response:', JSON.stringify(response));
        const text = response.candidates[0].content.parts[0].text;
        const clean = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        setResult(parsed);
      } catch (err) {
        setError('Failed to analyze image. Please try again.');
        console.log('Analysis error:', err);
      } finally {
        setLoading(false);
      }
    }
    analyze();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>Analysis Result</Text>
      <Text style={styles.personaTag}>{promptKey?.toUpperCase() || 'ACADEMIC'} ANALYSIS</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Objects</Text>
        {result.objects.map((obj, i) => (
          <View key={i} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.item}>{obj}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Context</Text>
        <Text style={styles.item}>{result.context}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Activities</Text>
        <Text style={styles.item}>{result.activities}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Recommendations</Text>
        <Text style={styles.item}>{result.recommendations}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/CameraScreen')}>
        <Text style={styles.buttonText}>Take Another Photo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  contentContainer: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F5F6FA' },
  heading: { fontSize: 26, fontWeight: 'bold', color: '#1F2A44', marginBottom: 4 },
  personaTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5B3FA3',
    letterSpacing: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5B3FA3',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5B3FA3',
    marginTop: 7,
    marginRight: 8,
  },
  item: { fontSize: 15, color: '#2B2F38', lineHeight: 21, flex: 1 },
  loadingText: { marginTop: 12, fontSize: 16, color: '#5A6472' },
  errorText: { fontSize: 16, color: '#B3261E', marginBottom: 16, textAlign: 'center' },
  button: {
    backgroundColor: '#5B3FA3',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});