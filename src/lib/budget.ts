import { barPercent, formatPercent } from './formatRupiah';
import type { BudgetStatus, Rupiah } from '../types/domain';
import type { BudgetEvaluation } from '../types/pricing';

export const BUDGET_MIN = 10000;
export const BUDGET_MAX = 500000;

export function getProjection(spentToday: Rupiah, orderValue: Rupiah): Rupiah {
  return spentToday + orderValue;
}

export function getBudgetStatus(projection: Rupiah, budget: Rupiah): BudgetStatus {
  if (projection > budget) return 'EXCEEDED';
  if (projection * 100 >= budget * 80) return 'WARN';
  return 'OK';
}

export function evaluateBudget(
  budget: Rupiah | null,
  spentToday: Rupiah,
  orderValue: Rupiah,
): BudgetEvaluation | null {
  if (budget === null) return null;
  const projection = getProjection(spentToday, orderValue);
  return {
    budget,
    projection,
    status: getBudgetStatus(projection, budget),
    leftover: Math.max(0, budget - projection),
    exceededBy: Math.max(0, projection - budget),
    barPercent: barPercent(projection, budget),
    percentLabel: formatPercent(projection, budget),
  };
}

export type HeaderBudgetView =
  | { readonly kind: 'NOT_SET' }
  | { readonly kind: 'REMAINING'; readonly amount: Rupiah }
  | { readonly kind: 'EXCEEDED'; readonly amount: Rupiah };

export function getHeaderBudgetView(budget: Rupiah | null, spentToday: Rupiah): HeaderBudgetView {
  if (budget === null) return { kind: 'NOT_SET' };
  if (spentToday > budget) return { kind: 'EXCEEDED', amount: spentToday - budget };
  return { kind: 'REMAINING', amount: budget - spentToday };
}

export type BudgetInputError = 'EMPTY' | 'NOT_INTEGER' | 'BELOW_MIN' | 'ABOVE_MAX';

export const BUDGET_ERROR_MESSAGES: Record<BudgetInputError, string> = {
  EMPTY: 'Isi budget harian dulu. Contoh: 50000.',
  NOT_INTEGER: 'Budget harus bilangan bulat tanpa desimal.',
  BELOW_MIN: 'Budget minimal Rp10.000.',
  ABOVE_MAX: 'Budget maksimal Rp500.000.',
};

export type BudgetInputResult =
  | { readonly ok: true; readonly value: Rupiah }
  | { readonly ok: false; readonly error: BudgetInputError; readonly message: string };

function reject(error: BudgetInputError): BudgetInputResult {
  return { ok: false, error, message: BUDGET_ERROR_MESSAGES[error] };
}

export function validateBudgetInput(raw: string): BudgetInputResult {
  const text = raw.trim();
  if (text.length === 0) return reject('EMPTY');
  if (!/^[0-9]+$/.test(text)) return reject('NOT_INTEGER');
  const digits = text.replace(/^0+/, '');
  if (digits.length === 0) return reject('BELOW_MIN');
  if (digits.length > 6) return reject('ABOVE_MAX');
  const value = Number(digits);
  if (value < BUDGET_MIN) return reject('BELOW_MIN');
  if (value > BUDGET_MAX) return reject('ABOVE_MAX');
  return { ok: true, value };
}
