export function floorDiv(dividend: number, divisor: number): number {
  if (!Number.isSafeInteger(dividend) || !Number.isSafeInteger(divisor) || dividend < 0 || divisor <= 0) {
    throw new RangeError('floorDiv: operan harus bilangan bulat aman, dividend >= 0, divisor > 0 (BR-01)');
  }
  return (dividend - (dividend % divisor)) / divisor;
}

export function clampInt(value: number, min: number, max: number): number {
  if (!Number.isInteger(value)) {
    throw new RangeError('clampInt: nilai harus bilangan bulat');
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function assertRupiah(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(name + ': harus bilangan bulat Rupiah >= 0 (BR-01)');
  }
}
