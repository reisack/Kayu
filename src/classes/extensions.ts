// Nullable Type
export type Nullable<T> = T | null | undefined;

declare global {
  // extends Array
  interface Array<T> {
    clear(): void
  }
}

// Clear array without loosing reference
Array.prototype.clear = function() {
  while (this.length) {
    this.pop();
  }
}