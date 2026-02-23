import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const resources = [
  {
    title: 'Expo Documentation',
    description: 'Full docs for the Expo SDK and CLI tools.',
    url: 'https://docs.expo.dev',
    tag: 'DOCS',
  },
  {
    title: 'Expo Router',
    description: 'File-based routing for React Native apps.',
    url: 'https://expo.github.io/router',
    tag: 'ROUTING',
  },
  {
    title: 'React Native Docs',
    description: 'Core components, APIs, and guides.',
    url: 'https://reactnative.dev',
    tag: 'CORE',
  },
  {
    title: 'React Native Web',
    description: 'Run your RN app in any browser.',
    url: 'https://necolas.github.io/react-native-web/',
    tag: 'WEB',
  },
  {
    title: 'EAS Build',
    description: 'Cloud build service for native apps by Expo.',
    url: 'https://docs.expo.dev/build/introduction/',
    tag: 'CI/CD',
  },
  {
    title: 'TypeScript Handbook',
    description: 'Everything you need to know about TypeScript.',
    url: 'https://www.typescriptlang.org/docs/handbook/',
    tag: 'LANGUAGE',
  },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Resources</Text>
        <Text style={styles.sub}>Handy links to get you building fast.</Text>

        {resources.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => Linking.openURL(item.url)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>{item.description}</Text>
            <Text style={styles.cardUrl}>{item.url}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { padding: 20, paddingTop: 16 },
  heading: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
    marginTop: 8,
  },
  sub: {
    color: '#666666',
    fontSize: 15,
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e1e1e',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  tag: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagText: {
    color: '#6EE7B7',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  cardDesc: {
    color: '#666666',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  cardUrl: {
    color: '#444444',
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
