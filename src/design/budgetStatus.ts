import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { BudgetStatus } from '../types/domain';

export { getBudgetStatus } from '../lib/budget';

export interface BudgetStatusTokens {
  readonly label: 'Sesuai budget' | 'Mepet budget' | 'Melebihi budget';
  readonly Icon: LucideIcon;
  readonly badge: string;
  readonly banner: string;
  readonly icon: string;
  readonly fill: string;
}

export const BUDGET_STATUS: Record<BudgetStatus, BudgetStatusTokens> = {
  OK: { label: 'Sesuai budget', Icon: CircleCheck, badge: 'border-emerald-300 bg-emerald-50 text-emerald-800', banner: 'border-emerald-300 bg-emerald-50 text-emerald-800', icon: 'text-emerald-700', fill: 'bg-emerald-700' },
  WARN: { label: 'Mepet budget', Icon: TriangleAlert, badge: 'border-amber-300 bg-amber-50 text-amber-900', banner: 'border-amber-300 bg-amber-50 text-amber-900', icon: 'text-amber-700', fill: 'bg-amber-700' },
  EXCEEDED: { label: 'Melebihi budget', Icon: CircleX, badge: 'border-rose-300 bg-rose-50 text-rose-800', banner: 'border-rose-300 bg-rose-50 text-rose-800', icon: 'text-rose-700', fill: 'bg-rose-700' },
};
