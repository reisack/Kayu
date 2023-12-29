export interface IScaleFactor {
  threeQuarter: number;
  half: number;
  third: number;
  quarter: number;
  oneEighth: number;
  oneTwelfth: number;
  oneSixteenth: number;
  oneThirtySecond: number;
}

export interface IStyle {
  primaryColor: string;
  primaryFontColor: string;
  secondaryColor: string;
  secondaryFontColor: string;
  primaryBackgroundColor: string;
  secondaryBackgroundColor: string;
  tertiaryBackgroundColor: string;
  scaleFactor: IScaleFactor;
}
