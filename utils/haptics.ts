import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

/** Light tap — toggles, pills, minor interactions. */
export function hapticLight() {
  if (isNative) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

/** Medium tap — button presses, drawer open/close. */
export function hapticMedium() {
  if (isNative) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

/** Selection tick — presentation nav, confirmations. */
export function hapticSelection() {
  if (isNative) {
    Haptics.selectionAsync();
  }
}
