import { Nullable } from '@/extensions';

export default class NutritionValues {
  fat: Nullable<number>;
  sugar: Nullable<number>;
  salt: Nullable<number>;
  novaGroup: Nullable<number>;
  eco: Nullable<number>;
  additives: Nullable<string[]>;

  constructor(
    fat: Nullable<number> = null,
    sugar: Nullable<number> = null,
    salt: Nullable<number> = null,
    novaGroup: Nullable<number> = null,
    eco: Nullable<number> = null,
    additives: Nullable<string[]> = null,
  ) {
    this.fat = fat;
    this.sugar = sugar;
    this.salt = salt;
    this.novaGroup = novaGroup;
    this.eco = eco;
    this.additives = additives;
  }
}
