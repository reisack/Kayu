import ToastService from '@/services/toast-service';
import { Platform, ToastAndroid } from 'react-native';

describe('Toast service', () => {
  let platformOsDescriptor: PropertyDescriptor | undefined;

  beforeAll(() => {
    platformOsDescriptor = Object.getOwnPropertyDescriptor(Platform, 'OS');
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(ToastAndroid, 'show').mockImplementation(() => undefined);
  });

  afterEach(() => {
    if (platformOsDescriptor) {
      Object.defineProperty(Platform, 'OS', platformOsDescriptor);
    }
  });

  it('should show the provided message on Android', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'android',
    });

    ToastService.show('toast.message', ToastAndroid.SHORT);

    expect(ToastAndroid.show).toHaveBeenCalledWith(
      'toast.message',
      ToastAndroid.SHORT,
    );
  });

  it('should do nothing on non-Android platforms', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'ios',
    });

    ToastService.show('toast.message');

    expect(ToastAndroid.show).not.toHaveBeenCalled();
  });
});
