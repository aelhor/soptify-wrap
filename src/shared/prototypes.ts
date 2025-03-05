export {};
declare global {
  export interface Array<T> {
    equals(array: T): Array<T>;
    hasSameItems(array: T): Array<T>;
  }
  export interface Date {
    addDays(days: number): string;
    addMins(mins: number): Date;
  }
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array: Array<any>): any {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

Array.prototype.hasSameItems = function (array: Array<any>): any {
  if (this.sort().join(',') === array.sort().join(',')) {
    return true;
  } else {
    return false;
  }
};

Date.prototype.addDays = function (days: number) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

Date.prototype.addMins = function (mins: number) {
  const date = new Date(this.valueOf());
  date.setMinutes(date.getMinutes() + mins);
  return date;
};

// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', { enumerable: false });
Object.defineProperty(Array.prototype, 'hasSameItems', { enumerable: false });
Object.defineProperty(Date.prototype, 'addDays', { enumerable: false });
Object.defineProperty(Date.prototype, 'addMins', { enumerable: false });
