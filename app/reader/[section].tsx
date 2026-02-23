import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  PanResponder,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { contentColumn } from '@/constants/layout';
import { useFontSize } from '@/context/FontSizeContext';
import PrayerBlock from '@/components/PrayerBlock';
import PresentationView from '@/components/PresentationView';
import SectionDrawer from '@/components/SectionDrawer';
import { Ionicons } from '@expo/vector-icons';
import { LiturgicalText, PrayerBlock as PrayerBlockType } from '@/data/types';

function loadSection(id: string): LiturgicalText | null {
  switch (id) {
    case 'kidan':
      return require('@/data/kidan.json');
    case 'serate-kidase':
      return require('@/data/serate-kidase.json');
    default:
      return null;
  }
}

export default function ReaderScreen() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const navigation = useNavigation();
  const { scale } = useFontSize();
  const [presentationMode, setPresentationMode] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentResultIdx, setCurrentResultIdx] = useState(0);
  const [presentationStartBlockId, setPresentationStartBlockId] = useState<string | undefined>(undefined);

  const scrollViewRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<number[]>([]);
  const blockOffsets = useRef<Record<string, number>>({});

  /* Swipe left to open section drawer (mobile) */
  const swipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, { dx, dy }) =>
        Platform.OS !== 'web' && dx < -20 && Math.abs(dx) > Math.abs(dy) * 2,
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -50) setDrawerVisible(true);
      },
    }),
  ).current;

  const data = loadSection(section);

  const allBlocks: PrayerBlockType[] = data
    ? data.sections.flatMap((sec) => sec.blocks)
    : [];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !data) return [];
    const q = searchQuery.toLowerCase();
    const results: Array<{ sectionTitle: string; block: PrayerBlockType }> = [];
    for (const sec of data.sections) {
      for (const block of sec.blocks) {
        const haystack = [block.geez, block.amharic, block.english, block.transliteration]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (haystack.includes(q)) {
          results.push({ sectionTitle: sec.title.english, block });
        }
      }
    }
    return results;
  }, [searchQuery, data]);

  const navigateToResult = useCallback((idx: number) => {
    if (searchResults.length === 0) return;
    const bounded = Math.max(0, Math.min(idx, searchResults.length - 1));
    setCurrentResultIdx(bounded);
    const { block } = searchResults[bounded];
    const y = blockOffsets.current[block.id] ?? 0;
    scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 120), animated: true });
    setPresentationStartBlockId(block.id);
  }, [searchResults]);

  // Auto-navigate to first result when query changes
  useEffect(() => {
    if (searchResults.length > 0 && searchQuery.trim()) {
      setCurrentResultIdx(0);
      const { block } = searchResults[0];
      const y = blockOffsets.current[block.id] ?? 0;
      scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 120), animated: true });
      setPresentationStartBlockId(block.id);
    } else if (!searchQuery.trim()) {
      setPresentationStartBlockId(undefined);
    }
  }, [searchResults]);

  const currentResultBlockId = searchResults[currentResultIdx]?.block.id;

  useEffect(() => {
    if (data) {
      navigation.setOptions({
        title: data.title.english,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => setDrawerVisible(true)}
            style={{ marginRight: 16 }}
            hitSlop={8}
          >
            <Text style={{ color: Colors.burgundy, fontSize: 22 }}>☰</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [data, navigation]);

  function scrollToSection(index: number) {
    const y = sectionOffsets.current[index] ?? 0;
    scrollViewRef.current?.scrollTo({ y, animated: true });
  }

  useEffect(() => {
    if (presentationMode) {
      navigation.setOptions({ headerShown: false });
      if (Platform.OS === 'web') {
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    } else {
      navigation.setOptions({ headerShown: true });
      if (Platform.OS === 'web') {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
      } else {
        ScreenOrientation.unlockAsync();
      }
    }

    return () => {
      navigation.setOptions({ headerShown: true });
      if (Platform.OS !== 'web') {
        ScreenOrientation.unlockAsync();
      }
    };
  }, [presentationMode, navigation]);

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Section not found.</Text>
      </View>
    );
  }

  if (presentationMode) {
    return (
      <>
        <StatusBar style="light" hidden />
        <PresentationView
          blocks={allBlocks}
          sections={data.sections}
          onExit={() => setPresentationMode(false)}
          startBlockId={presentationStartBlockId}
        />
      </>
    );
  }

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={contentColumn.wrapper}>
          {/* Title block */}
          <View style={styles.titleBlock}>
            <Text style={styles.decorativeCross}>✦</Text>
            {data.title.geez && (
              <Text style={[styles.titleGeez, { fontSize: scale(38) }]}>{data.title.geez}</Text>
            )}
            <Text style={[styles.titleEnglish, { fontSize: scale(13) }]}>
              {data.title.english.toUpperCase()}
            </Text>
            <View style={styles.titleDivider}>
              <View style={styles.titleDividerFade} />
              <View style={styles.titleDividerLine} />
              <View style={styles.titleDividerFade} />
            </View>
          </View>

          {data.sections.map((sec, index) => (
            <View
              key={sec.id}
              onLayout={(e) => {
                sectionOffsets.current[index] = e.nativeEvent.layout.y;
              }}
            >
              <View style={styles.sectionHeading}>
                <View style={styles.sectionHeadingInner}>
                  <Text style={[styles.sectionTitle, { fontSize: scale(11) }]}>
                    {sec.title.english.toUpperCase()}
                  </Text>
                </View>
              </View>
              {sec.blocks.map((block) => (
                <PrayerBlock key={block.id} block={block} />
              ))}
            </View>
          ))}

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Floating search overlay */}
      {searchVisible && (
        <View style={styles.searchOverlay}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              placeholder="Search…"
              placeholderTextColor={Colors.textDim}
              autoFocus
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.searchCloseBtn}
              onPress={() => {
                setSearchVisible(false);
                setSearchQuery('');
                setCurrentResultIdx(0);
                setPresentationStartBlockId(undefined);
              }}
            >
              <Text style={styles.searchCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          {searchQuery.trim().length > 0 && (
            <View style={styles.searchNav}>
              <TouchableOpacity
                style={[styles.navBtn, currentResultIdx === 0 && styles.navBtnDisabled]}
                onPress={() => navigateToResult(currentResultIdx - 1)}
                disabled={currentResultIdx === 0}
              >
                <Text style={styles.navBtnText}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.searchCountText}>
                {searchResults.length === 0
                  ? 'No results'
                  : `${currentResultIdx + 1} of ${searchResults.length}`}
              </Text>
              <TouchableOpacity
                style={[styles.navBtn, currentResultIdx === searchResults.length - 1 && styles.navBtnDisabled]}
                onPress={() => navigateToResult(currentResultIdx + 1)}
                disabled={currentResultIdx === searchResults.length - 1}
              >
                <Text style={styles.navBtnText}>▼</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.presentationBtn}
        onPress={() => setPresentationMode(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.presentationBtnText}>Present</Text>
      </TouchableOpacity>

      <SectionDrawer
        sections={data.sections}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSelect={scrollToSection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },

  /* ── Title area ── */
  titleBlock: {
    marginBottom: 32,
    paddingBottom: 20,
    alignItems: 'center',
  },
  decorativeCross: {
    fontSize: 20,
    color: Colors.accent,
    marginBottom: 10,
  },
  titleGeez: {
    fontFamily: Fonts.serifExtraBold,
    color: Colors.burgundy,
    letterSpacing: 3,
    marginBottom: 8,
    textAlign: 'center',
  },
  titleEnglish: {
    fontFamily: Fonts.bodyMedium,
    color: Colors.textMuted,
    letterSpacing: 6,
  },
  titleDivider: {
    flexDirection: 'row',
    marginTop: 18,
    width: '35%',
    maxWidth: 160,
    alignItems: 'center',
  },
  titleDividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.accent,
    borderRadius: 1,
  },
  titleDividerFade: {
    width: 16,
    height: 2,
    backgroundColor: Colors.accent,
    opacity: 0.25,
    borderRadius: 1,
  },

  /* ── Section headings (decorative badge) ── */
  sectionHeading: {
    marginTop: 32,
    marginBottom: 10,
    alignItems: 'center',
  },
  sectionHeadingInner: {
    backgroundColor: Colors.burgundy,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 5,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontFamily: Fonts.bodyMedium,
    fontWeight: '700',
    letterSpacing: 2,
  },

  /* ── Error ── */
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: Fonts.bodyRegular,
    color: Colors.textMuted,
    fontSize: 16,
  },

  bottomPadding: { height: 100 },

  /* ── Floating present button ── */
  presentationBtn: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    backgroundColor: Colors.burgundy,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  presentationBtnText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bodyMedium,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    color: Colors.text,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchCloseBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchCloseText: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  searchNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 4,
  },
  navBtn: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  searchCountText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});
