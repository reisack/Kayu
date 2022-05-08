import { Nullable } from "./extensions";

export default class Score {
  fat: Nullable<number>;
  sugar: Nullable<number>;
  salt: Nullable<number>;
  novaGroup: Nullable<number>;
  eco: Nullable<number>;
  additives: Nullable<number>;

  constructor(fat: Nullable<number> = null, sugar: Nullable<number> = null, salt: Nullable<number> = null, novaGroup: Nullable<number> = null, eco: Nullable<number> = null, additives: Nullable<number> = null) {
    this.fat = this.limitTo100(fat);
    this.sugar = this.limitTo100(sugar);
    this.salt = this.limitTo100(salt);
    this.novaGroup = this.limitTo100(novaGroup);
    this.eco = this.limitTo100(eco);
    this.additives = this.limitTo100(additives);
  }

  private limitTo100(score: Nullable<number>): Nullable<number> {
    if (score === undefined || score === null) {
      return null;
    }

    return score > 100 ? 100 : score;
  }

  public getTotal(): number {
    let total = 0;
    total += this.fat ?? 0;
    total += this.sugar ?? 0;
    total += this.salt ?? 0;
    total += this.novaGroup ?? 0;
    total += this.eco ?? 0;
    total += this.additives ?? 0;

    return total;
  }
}