import { Platform, ToastAndroid } from 'react-native';

export default class ToastService {
  public static show(message: string, duration?: number): void {
    // Kayu is Android-only today, so non-Android platforms intentionally no-op here.
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, duration || ToastAndroid.LONG);
    }
  }
}
