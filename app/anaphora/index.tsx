import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { contentColumn } from '@/constants/layout';
import CrossIcon from '@/components/CrossIcon';
import { hapticLight } from '@/utils/haptics';
import { AnaphoraMetadata } from '@/data/types';

const ANAPHORAS: AnaphoraMetadata[] = require('@/data/anaphoras/anaphoras.json');

export default function AnaphoraListScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={contentColumn.wrapper}>
          <View style={styles.header}>
            <CrossIcon size={18} color={Colors.accent} />
            <Text style={styles.titleGeez}>ፍሬ ቅዳሴ</Text>
            <Text style={styles.titleEnglish}>FERE KIDASE</Text>
            <Text style={styles.subtitle}>Select an anaphora to read</Text>
          </View>

          {ANAPHORAS.map((anaphora) => (
            <TouchableOpacity
              key={anaphora.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => {
                hapticLight();
                router.push(`/anaphora/${anaphora.id}`);
              }}
            >
              <View style={styles.iconBadge}>
                <CrossIcon size={14} color="#FFF8F0" />
              </View>
              <View style={styles.cardText}>
                {anaphora.name.geez && (
                  <Text style={styles.cardGeez}>{anaphora.name.geez}</Text>
                )}
                <Text style={styles.cardTitle}>{anaphora.name.english}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textDim} />
            </TouchableOpacity>
          ))}

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },

  /* ── Header ── */
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 24,
  },
  titleGeez: {
    fontFamily: Fonts.serifExtraBold,
    color: Colors.burgundy,
    fontSize: 44,
    letterSpacing: 3,
  },
  titleEnglish: {
    fontFamily: Fonts.bodyMedium,
    color: Colors.textMuted,
    fontSize: 12,
    letterSpacing: 5,
    marginTop: 6,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: Fonts.bodyItalic,
    color: Colors.textDim,
    fontSize: 14,
    fontStyle: 'italic',
  },

  /* ── Cards (matching home subsection style) ── */
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardGeez: {
    fontFamily: Fonts.serifBold,
    color: Colors.text,
    fontSize: 16,
    marginBottom: 1,
  },
  cardTitle: {
    fontFamily: Fonts.bodyItalic,
    color: Colors.textDim,
    fontSize: 12,
    fontStyle: 'italic',
  },

  bottomPadding: { height: 40 },
});
