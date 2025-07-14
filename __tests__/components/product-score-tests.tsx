import React from 'react';
import {render, fireEvent, act} from '@testing-library/react-native';
import ProductScore from '@/components/product-score';
import {ProductInformationEnum} from '@/enums';
import {Alert} from 'react-native';

// --- MOCKS ---

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (k: string) => k}),
}));

// Mock Consts
jest.mock('@/consts', () => ({
  style: {
    primaryColor: '#229',
    primaryFontColor: '#444',
    scaleFactor: {
      threeQuarter: 0.75,
      oneSixteenth: 0.0625,
      oneTwelfth: 0.0833,
      oneThirtySecond: 0.03125,
    },
  },
}));

// Mock image require
jest.mock('../../assets/images/help.png', () => 1);

// Mock useWindowDimensions
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => ({
    width: 400,
  }),
}));

// Mock ProgressBar to just print its props for assertion
jest.mock(
  'react-native-progress/Bar',
  () => (props: Record<string, unknown>) => {
    const {View, Text} = require('react-native');
    return (
      <View>
        <Text testID="progress-bar-props">{JSON.stringify(props)}</Text>
      </View>
    );
  },
);

// Mock ProductScoreService
jest.mock('@/services/product-score-service', () =>
  jest.fn().mockImplementation(() => ({
    getNutritionLabel: (info: ProductInformationEnum) =>
      `nutrition-label-${info}`,
    getHelpMessage: (info: ProductInformationEnum) => `help-message-${info}`,
    getExpression: (score: number, info: ProductInformationEnum) =>
      `expression-${score}-${info}`,
  })),
);

// --- SETUP ---
beforeEach(() => {
  jest.useFakeTimers(); // Because the component uses setInterval!
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

// --- TESTS ---
describe('ProductScore', () => {
  const baseProps = {
    score: 70,
    nutritionValue: 20,
    productInfo: ProductInformationEnum.fat,
  };

  it('renders label, score and progress bar', () => {
    const {getByText, getByTestId} = render(<ProductScore {...baseProps} />);
    // Check label (uses t(getNutritionLabel))
    expect(getByText('nutrition-label-0')).toBeTruthy();
    // Check score expression (uses t(getExpression))
    expect(getByText('expression-70-0')).toBeTruthy();
    // Check progress bar props are present and indeterminate is true initially
    expect(getByTestId('progress-bar-props').props.children).toContain(
      '"indeterminate":true',
    );
  });

  it('sets progress bar indeterminate to false after timer', () => {
    const {getByTestId} = render(<ProductScore {...baseProps} />);

    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1100); // ensure >1000ms for setInterval
    });

    // Re-render or force update, then check progress bar
    // This works because setInterval triggers a state update
    expect(getByTestId('progress-bar-props').props.children).toContain(
      '"indeterminate":false',
    );
  });

  it('opens alert with correct messages on help icon press', () => {
    // Mock Alert
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const {getByTestId} = render(<ProductScore {...baseProps} />);
    const pressable = getByTestId('pressable-info-icon');

    fireEvent.press(pressable);

    expect(alertSpy).toHaveBeenCalledWith('informations', 'help-message-0');

    alertSpy.mockRestore();
  });

  it('renders with string[] nutritionValue', () => {
    const stringArrayProps = {
      score: 2,
      nutritionValue: ['E100', 'E200'],
      productInfo: ProductInformationEnum.additives,
    };

    const {getByText} = render(<ProductScore {...stringArrayProps} />);

    expect(getByText('nutrition-label-5')).toBeTruthy();
    expect(getByText('expression-2-5')).toBeTruthy();
  });

  it('renders nothing when score is null', () => {
    const {toJSON} = render(
      <ProductScore
        score={null}
        nutritionValue={20}
        productInfo={ProductInformationEnum.fat}
      />,
    );

    // Just returns an empty <View>
    expect(toJSON()).toMatchSnapshot();
  });
});
