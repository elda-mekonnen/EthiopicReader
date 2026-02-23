import { StyleSheet } from 'react-native';

/**
 * Shared layout constants for the "centered manuscript" look.
 *
 * CONTENT_MAX_WIDTH constrains the reading column on wide screens
 * (tablets, desktop web) while having no effect on phones.
 * 720px ≈ Tailwind's max-w-3xl — a comfortable book-width column.
 */
export const CONTENT_MAX_WIDTH = 720;

/**
 * Drop this into any ScrollView's contentContainerStyle to get the
 * centered, max-width column. Combine with screen-specific padding.
 */
export const contentColumn = StyleSheet.create({
  wrapper: {
    maxWidth: CONTENT_MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
});
