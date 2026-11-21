import { describe, it, expect } from 'vitest';
import { formatRupiah, formatDiscount, formatSignedRupiah, formatPercent, barPercent } from '../lib/formatRupiah';

const RUPIAH_RE = /^[\u2212+]?Rp\d{1,3}(\.\d{3})*$/;

describe('formatRupiah', () => {
  it('formats positive integers with dot thousands separator', () => {
    expect(formatRupiah(0)).toBe('Rp0');
    expect(formatRupiah(5000)).toBe('Rp5.000');
    expect(formatRupiah(50000)).toBe('Rp50.000');
    expect(formatRupiah(38500)).toBe('Rp38.500');
    expect(formatRupiah(1000000)).toBe('Rp1.000.000');
    expect(formatRupiah(1250000)).toBe('Rp1.250.000');
  });

  it('formats negative with U+2212 minus', () => {
    expect(formatRupiah(-5000)).toBe('\u2212Rp5.000');
  });

  it('throws on non-integer', () => {
    expect(() => formatRupiah(50.5)).toThrow(RangeError);
    expect(() => formatRupiah(NaN)).toThrow(RangeError);
  });

  it('output matches regex pattern', () => {
    expect(formatRupiah(0)).toMatch(RUPIAH_RE);
    expect(formatRupiah(50000)).toMatch(RUPIAH_RE);
    expect(formatRupiah(-1000)).toMatch(RUPIAH_RE);
  });

  it('contains no non-breaking spaces (\\u00A0, \\u202F, \\u2009)', () => {
    const samples = [formatRupiah(0), formatRupiah(50000), formatRupiah(1250000), formatRupiah(-5000)];
    for (const s of samples) {
      expect(s).not.toContain('\u00A0');
      expect(s).not.toContain('\u202F');
      expect(s).not.toContain('\u2009');
    }
  });
});

describe('formatDiscount', () => {
  it('always negative with U+2212', () => {
    expect(formatDiscount(0)).toBe('\u2212Rp0');
    expect(formatDiscount(5000)).toBe('\u2212Rp5.000');
    expect(formatDiscount(8000)).toBe('\u2212Rp8.000');
  });

  it('throws on negative or non-integer', () => {
    expect(() => formatDiscount(-1)).toThrow(RangeError);
    expect(() => formatDiscount(1.5)).toThrow(RangeError);
  });

  it('output matches regex', () => {
    expect(formatDiscount(5000)).toMatch(RUPIAH_RE);
  });
});

describe('formatSignedRupiah', () => {
  it('positive gets + prefix', () => {
    expect(formatSignedRupiah(3000)).toBe('+Rp3.000');
    expect(formatSignedRupiah(0)).toBe('+Rp0');
  });

  it('negative gets U+2212 prefix', () => {
    expect(formatSignedRupiah(-1000)).toBe('\u2212Rp1.000');
  });

  it('output matches regex', () => {
    expect(formatSignedRupiah(3000)).toMatch(RUPIAH_RE);
    expect(formatSignedRupiah(-1000)).toMatch(RUPIAH_RE);
  });
});

describe('formatPercent (F-19)', () => {
  it('exactly 100% when equal', () => {
    expect(formatPercent(50000, 50000)).toBe('100%');
  });

  it('39.999/50.000 → "79%"', () => {
    expect(formatPercent(39999, 50000)).toBe('79%');
  });

  it('50.001/50.000 → "101%"', () => {
    expect(formatPercent(50001, 50000)).toBe('101%');
  });

  it('40.000/50.000 → "80%"', () => {
    expect(formatPercent(40000, 50000)).toBe('80%');
  });

  it('40.500/50.000 → "81%"', () => {
    expect(formatPercent(40500, 50000)).toBe('81%');
  });

  it('53.900/50.000 → "107,8%"', () => {
    expect(formatPercent(53900, 50000)).toBe('107,8%');
  });

  it('throws on non-integer or budget <= 0', () => {
    expect(() => formatPercent(50.5, 50000)).toThrow(RangeError);
    expect(() => formatPercent(50000, 0)).toThrow(RangeError);
  });
});

describe('barPercent', () => {
  it('floors and caps at 100', () => {
    expect(barPercent(0, 50000)).toBe(0);
    expect(barPercent(40500, 50000)).toBe(81);
    expect(barPercent(59000, 50000)).toBe(100);
  });
});
