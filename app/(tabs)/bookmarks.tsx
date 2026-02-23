import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

export default function BookmarksScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
      </View>
      <View style={styles.emptyState}>
        <View style={styles.iconCircle}>
          <Ionicons name="bookmark-outline" size={36} color={Colors.accent} />
        </View>
        <Text style={styles.emptyTitle}>No saved prayers yet</Text>
        <Text style={styles.emptyText}>
          Your bookmarked prayers and anaphoras will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontFamily: Fonts.serifBold,
    fontSize: 28,
    color: Colors.text,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: Fonts.serifBold,
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 15,
    color: Colors.textDim,
    textAlign: 'center',
    lineHeight: 22,
  },
});
