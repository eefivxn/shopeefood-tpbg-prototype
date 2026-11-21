import { describe, it, expect } from 'vitest';
import {
  getProjection,
  getBudgetStatus,
  evaluateBudget,
  getHeaderBudgetView,
  validateBudgetInput,
  BUDGET_MIN,
  BUDGET_MAX,
} from '../lib/budget';
import { formatPercent, barPercent } from '../lib/formatRupiah';

describe('getProjection', () => {
  it('spentToday + orderValue', () => {
    expect(getProjection(12000, 28500)).toBe(40500);
    expect(getProjection(0, 50000)).toBe(50000);
  });
});

describe('getBudgetStatus', () => {
  it('OK when projection*100 < budget*80', () => {
    expect(getBudgetStatus(32000, 50000)).toBe('OK');
  });

  it('WARN at exactly 80%', () => {
    expect(getBudgetStatus(40000, 50000)).toBe('WARN');
  });

  it('WARN at exactly 100%', () => {
    expect(getBudgetStatus(50000, 50000)).toBe('WARN');
  });

  it('EXCEEDED when projection > budget', () => {
    expect(getBudgetStatus(50001, 50000)).toBe('EXCEEDED');
    expect(getBudgetStatus(59000, 50000)).toBe('EXCEEDED');
  });
});

describe('projection/status table', () => {
  it('12000 + 20000 = 32000 (64%) OK', () => {
    const e = evaluateBudget(50000, 12000, 20000);
    expect(e?.status).toBe('OK');
    expect(e?.projection).toBe(32000);
  });

  it('12000 + 28500 = 40500 (81%) WARN', () => {
    const e = evaluateBudget(50000, 12000, 28500);
    expect(e?.status).toBe('WARN');
    expect(e?.projection).toBe(40500);
  });

  it('12000 + 47000 = 59000 (118%) EXCEEDED', () => {
    const e = evaluateBudget(50000, 12000, 47000);
    expect(e?.status).toBe('EXCEEDED');
    expect(e?.projection).toBe(59000);
  });

  it('0 + 50000 = 50000 (100%) WARN (TS-01 boundary)', () => {
    const e = evaluateBudget(50000, 0, 50000);
    expect(e?.status).toBe('WARN');
  });

  it('0 + 39999 = OK (lower bound of WARN)', () => {
    const e = evaluateBudget(50000, 0, 39999);
    expect(e?.status).toBe('OK');
  });

  it('0 + 40000 = WARN (80% exactly)', () => {
    const e = evaluateBudget(50000, 0, 40000);
    expect(e?.status).toBe('WARN');
  });

  it('0 + 50001 = EXCEEDED (boundary)', () => {
    const e = evaluateBudget(50000, 0, 50001);
    expect(e?.status).toBe('EXCEEDED');
  });

  it('TS-06: budget 100000, all 6 restaurants OK', () => {
    const estimates = [50000, 26500, 25000, 28500, 41900, 35000];
    for (const est of estimates) {
      const e = evaluateBudget(100000, 12000, est);
      expect(e?.status).toBe('OK');
    }
  });

  it('returns null when budget is null', () => {
    expect(evaluateBudget(null, 12000, 28500)).toBeNull();
  });

  it('leftover and exceededBy computed correctly', () => {
    const ok = evaluateBudget(50000, 12000, 20000);
    expect(ok?.leftover).toBe(18000);
    expect(ok?.exceededBy).toBe(0);

    const ex = evaluateBudget(50000, 12000, 47000);
    expect(ex?.leftover).toBe(0);
    expect(ex?.exceededBy).toBe(9000);
  });
});

describe('getHeaderBudgetView', () => {
  it('NOT_SET when budget null', () => {
    expect(getHeaderBudgetView(null, 12000)).toEqual({ kind: 'NOT_SET' });
  });

  it('REMAINING when spentToday <= budget', () => {
    expect(getHeaderBudgetView(50000, 12000)).toEqual({ kind: 'REMAINING', amount: 38000 });
    expect(getHeaderBudgetView(50000, 50000)).toEqual({ kind: 'REMAINING', amount: 0 });
  });

  it('EXCEEDED when spentToday > budget', () => {
    expect(getHeaderBudgetView(50000, 59000)).toEqual({ kind: 'EXCEEDED', amount: 9000 });
  });
});

describe('formatPercent (F-19 reconciliation)', () => {
  it('exactly 100% when projection === budget', () => {
    expect(formatPercent(50000, 50000)).toBe('100%');
  });

  it('39.999/50.000 → "79%" (OK, floor whole-percent)', () => {
    expect(formatPercent(39999, 50000)).toBe('79%');
  });

  it('50.001/50.000 → "101%" (EXCEEDED, ceil whole-percent)', () => {
    expect(formatPercent(50001, 50000)).toBe('101%');
  });

  it('40.000/50.000 → "80%" (WARN)', () => {
    expect(formatPercent(40000, 50000)).toBe('80%');
  });

  it('40.500/50.000 → "81%" (WARN)', () => {
    expect(formatPercent(40500, 50000)).toBe('81%');
  });

  it('53.900/50.000 → "107,8%" (EXCEEDED, nearest tenth)', () => {
    expect(formatPercent(53900, 50000)).toBe('107,8%');
  });

  it('59.000/50.000 → "118%" (EXCEEDED)', () => {
    expect(formatPercent(59000, 50000)).toBe('118%');
  });

  it('32.000/50.000 → "64%" (OK)', () => {
    expect(formatPercent(32000, 50000)).toBe('64%');
  });

  it('TS-06: 62.000/100.000 → "62%"', () => {
    expect(formatPercent(62000, 100000)).toBe('62%');
  });
});

describe('barPercent', () => {
  it('capped at 100', () => {
    expect(barPercent(59000, 50000)).toBe(100);
  });

  it('normal case', () => {
    expect(barPercent(40500, 50000)).toBe(81);
    expect(barPercent(32000, 50000)).toBe(64);
  });
});

describe('evaluateBudget percentLabel integration', () => {
  it('percentLabel matches formatPercent', () => {
    const e = evaluateBudget(50000, 12000, 40500);
    expect(e?.percentLabel).toBe('81%');
  });

  it('barPercent matches', () => {
    const e = evaluateBudget(50000, 12000, 40500);
    expect(e?.barPercent).toBe(81);
  });
});

describe('validateBudgetInput', () => {
  it('EMPTY for blank strings', () => {
    expect(validateBudgetInput('')).toEqual({ ok: false, error: 'EMPTY', message: 'Isi budget harian dulu. Contoh: 50000.' });
    expect(validateBudgetInput('   ')).toEqual({ ok: false, error: 'EMPTY', message: 'Isi budget harian dulu. Contoh: 50000.' });
  });

  it('ok for valid values with optional leading/trailing spaces and zeros', () => {
    expect(validateBudgetInput('50000')).toEqual({ ok: true, value: 50000 });
    expect(validateBudgetInput(' 50000 ')).toEqual({ ok: true, value: 50000 });
    expect(validateBudgetInput('00050000')).toEqual({ ok: true, value: 50000 });
  });

  it('ok for inclusive bounds', () => {
    expect(validateBudgetInput('10000').ok).toBe(true);
    expect(validateBudgetInput('500000').ok).toBe(true);
  });

  it('BELOW_MIN for values under 10000', () => {
    expect(validateBudgetInput('9999')).toEqual({ ok: false, error: 'BELOW_MIN', message: 'Budget minimal Rp10.000.' });
    expect(validateBudgetInput('0')).toEqual({ ok: false, error: 'BELOW_MIN', message: 'Budget minimal Rp10.000.' });
    expect(validateBudgetInput('000')).toEqual({ ok: false, error: 'BELOW_MIN', message: 'Budget minimal Rp10.000.' });
  });

  it('ABOVE_MAX for values over 500000', () => {
    expect(validateBudgetInput('500001')).toEqual({ ok: false, error: 'ABOVE_MAX', message: 'Budget maksimal Rp500.000.' });
    expect(validateBudgetInput('99999999999999999999')).toEqual({ ok: false, error: 'ABOVE_MAX', message: 'Budget maksimal Rp500.000.' });
  });

  it('NOT_INTEGER for decimal and non-numeric', () => {
    const cases = ['50.000', '50,5', '5e4', '-1', '50 000', 'abc', '５００００'];
    for (const c of cases) {
      expect(validateBudgetInput(c)).toEqual({ ok: false, error: 'NOT_INTEGER', message: 'Budget harus bilangan bulat tanpa desimal.' });
    }
  });

  it('BUDGET_MIN and BUDGET_MAX constants', () => {
    expect(BUDGET_MIN).toBe(10000);
    expect(BUDGET_MAX).toBe(500000);
  });
});
