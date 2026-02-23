import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useLanguage } from '@/context/LanguageContext';
import { useFontSize } from '@/context/FontSizeContext';
import { PrayerBlock as PrayerBlockType, Language } from '@/data/types';
import { LANGUAGE_LABELS } from '@/constants/languages';

const SPEAKER_COLORS: Record<string, string> = {
  priest: Colors.priest,
  deacon: Colors.deacon,
  congregation: Colors.congregation,
  all: Colors.text,
};

interface Props {
  block: PrayerBlockType;
}

export default function PrayerBlock({ block }: Props) {
  const { activeLanguages, primaryLanguage } = useLanguage();
  const { scale } = useFontSize();

  if (block.type === 'heading') {
    return (
      <View style={styles.headingContainer}>
        <View style={styles.headingBadge}>
          <Text style={[styles.heading, { fontSize: scale(12) }]}>
            {block.english ?? block.geez ?? block.amharic ?? ''}
          </Text>
        </View>
      </View>
    );
  }

  if (block.type === 'rubric') {
    return (
      <View style={styles.rubricContainer}>
        <Text style={[styles.rubric, { fontSize: scale(13) }]}>
          {block.english ?? block.geez ?? ''}
        </Text>
      </View>
    );
  }

  const speakerColor =
    block.speaker ? (SPEAKER_COLORS[block.speaker] ?? Colors.text) : Colors.text;

  // Collect languages that have content, primary language always first
  const langEntries: { lang: Language; text: string }[] = activeLanguages
    .map((lang) => ({ lang, text: block[lang] ?? '' }))
    .filter((e) => e.text.length > 0)
    .sort((a, b) => {
      if (a.lang === primaryLanguage) return -1;
      if (b.lang === primaryLanguage) return 1;
      return 0;
    });

  if (langEntries.length === 0) return null;

  const isResponse = block.type === 'response';
  const isCongregation = block.speaker === 'congregation' || block.speaker === 'all';

  const showLabels = false;

  return (
    <View style={[
      styles.blockContainer,
      isResponse && styles.responseContainer,
      isCongregation && styles.congregationContainer,
    ]}>
      {block.speaker && (
        <Text style={[styles.speakerLabel, { color: speakerColor, fontSize: scale(9) }]}>
          {block.speaker.toUpperCase()}
        </Text>
      )}
      <View style={styles.columnsRow}>
        {langEntries.map(({ lang, text }) => (
          <View key={lang} style={[styles.langColumn, langEntries.length === 1 && styles.langColumnFull]}>
            {showLabels && (
              <Text style={[styles.langLabel, { fontSize: scale(10) }]}>
                {LANGUAGE_LABELS[lang]}
              </Text>
            )}
            <Text
              style={[
                styles.prayerText,
                {
                  fontSize: scale(lang === 'geez' || lang === 'amharic' ? 18 : 16),
                  lineHeight: scale(lang === 'geez' || lang === 'amharic' ? 18 : 16) * 1.6,
                },
                (lang === 'geez' || lang === 'amharic') && styles.geezText,
                lang === 'english' && styles.englishText,
                lang === 'transliteration' && styles.transliterationText,
              ]}
            >
              {text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ── Heading (section title badge) ── */
  headingContainer: {
    marginTop: 36,
    marginBottom: 14,
    alignItems: 'center',
  },
  headingBadge: {
    backgroundColor: Colors.burgundy,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
    alignSelf: 'center',
  },
  heading: {
    color: '#FFFFFF',
    fontFamily: Fonts.bodyMedium,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  /* ── Rubric (instructions) ── */
  rubricContainer: {
    marginVertical: 10,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: Colors.border,
  },
  rubric: {
    color: Colors.rubric,
    fontFamily: Fonts.bodyItalic,
    fontStyle: 'italic',
    lineHeight: 22,
  },

  /* ── Prayer / Response blocks ── */
  blockContainer: {
    marginTop: 6,
    marginBottom: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  responseContainer: {
    paddingLeft: 24,
    borderLeftWidth: 6,
    borderLeftColor: Colors.accent,
    borderBottomWidth: 0,
    marginLeft: 8,
    marginBottom: 18,
    backgroundColor: Colors.accentDim,
    borderRadius: 2,
  },
  congregationContainer: {
    paddingLeft: 24,
    borderLeftWidth: 6,
    borderLeftColor: Colors.accent,
    backgroundColor: Colors.accentDim,
    borderRadius: 2,
    marginBottom: 20,
  },

  /* ── Speaker label ── */
  speakerLabel: {
    fontWeight: '800',
    letterSpacing: 3.5,
    marginBottom: 8,
    textTransform: 'uppercase',
    fontSize: 9,
  },

  /* ── Multi-column layout ── */
  columnsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  langColumn: {
    flex: 1,
  },
  langColumnFull: {
    flex: undefined,
    width: '100%',
  },
  langLabel: {
    color: Colors.textDim,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 3,
  },

  /* ── Text styles by language ── */
  prayerText: {
    color: Colors.text,
    fontFamily: Fonts.bodyRegular,
  },
  geezText: {
    fontWeight: '700',
    color: Colors.text,
  },
  englishText: {
    fontFamily: Fonts.bodyRegular,
    color: Colors.text,
  },
  transliterationText: {
    fontFamily: Fonts.bodyItalic,
    fontStyle: 'italic',
    color: Colors.textMuted,
  },
});
