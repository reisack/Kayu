// Nullable Type
export type Nullable<T> = T | null | undefined;

declare global {
  // extends Array
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Array<T> {
    clear(): void;
  }
}

// Clear array without loosing reference
// eslint-disable-next-line no-extend-native
Array.prototype.clear = function () {
  while (this.length) {
    this.pop();
  }
};
