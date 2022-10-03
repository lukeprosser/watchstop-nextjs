export const roundToTwoDec = (num: number) =>
  Math.round(num * 100 + Number.EPSILON) / 100;
