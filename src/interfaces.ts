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
  scaleFactor: IScaleFactor;
}
