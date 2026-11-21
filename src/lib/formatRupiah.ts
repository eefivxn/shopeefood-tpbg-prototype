const MINUS = '\u2212';

function groupThousands(digits: string): string {
  let result = '';
  for (let i = 0; i < digits.length; i += 1) {
    const remaining = digits.length - i;
    result += digits[i];
    if (remaining > 1 && remaining % 3 === 1) {
      result += '.';
    }
  }
  return result;
}

export function formatRupiah(amount: number): string {
  if (!Number.isInteger(amount)) {
    throw new RangeError('formatRupiah: nilai harus bilangan bulat (BR-01)');
  }
  const sign = amount < 0 ? MINUS : '';
  return sign + 'Rp' + groupThousands(String(Math.abs(amount)));
}

export function formatDiscount(amount: number): string {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new RangeError('formatDiscount: nilai harus bilangan bulat tidak negatif');
  }
  return MINUS + 'Rp' + groupThousands(String(amount));
}

export function formatSignedRupiah(amount: number): string {
  if (!Number.isInteger(amount)) {
    throw new RangeError('formatSignedRupiah: nilai harus bilangan bulat (BR-01)');
  }
  const sign = amount < 0 ? MINUS : '+';
  return sign + 'Rp' + groupThousands(String(Math.abs(amount)));
}

function statusFromProjection(projection: number, budget: number): 'OK' | 'WARN' | 'EXCEEDED' {
  if (projection > budget) return 'EXCEEDED';
  if (projection * 100 >= budget * 80) return 'WARN';
  return 'OK';
}

export function formatPercent(projection: number, budget: number): string {
  if (!Number.isInteger(projection) || !Number.isInteger(budget) || budget <= 0) {
    throw new RangeError('formatPercent: proyeksi dan budget harus bilangan bulat, budget > 0');
  }
  if (projection === budget) return '100%';
  const tenths = Math.floor((projection * 2000 + budget) / (2 * budget));
  const whole = Math.floor(tenths / 10);
  const fraction = tenths % 10;
  const status = statusFromProjection(projection, budget);
  if (fraction === 0 && whole === 80 && status === 'OK') {
    return Math.floor((projection * 100) / budget) + '%';
  }
  if (fraction === 0 && whole === 100 && status === 'EXCEEDED') {
    const ceil = Math.floor((projection * 100 + budget - 1) / budget);
    return ceil + '%';
  }
  return fraction === 0 ? whole + '%' : whole + ',' + fraction + '%';
}

export function barPercent(projection: number, budget: number): number {
  if (!Number.isInteger(projection) || !Number.isInteger(budget) || budget <= 0) {
    throw new RangeError('barPercent: proyeksi dan budget harus bilangan bulat, budget > 0');
  }
  return Math.min(100, Math.floor((projection * 100) / budget));
}
