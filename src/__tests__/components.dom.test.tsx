import { describe, it, expect, beforeEach } from 'vitest';
import { render, click, cleanup, byText } from '../test-support/dom';
import { Button } from '../components/Button';
import { QuantityStepper } from '../components/QuantityStepper';
import { Toggle } from '../components/FilterSortBar';
import { PriceNote } from '../components/PriceNote';
import { BudgetTracker } from '../components/BudgetTracker';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { NoticeBanner } from '../components/NoticeBanner';
import { Thumbnail } from '../components/Thumbnail';
import { BudgetExceededDialog } from '../components/BudgetExceededDialog';
import type { BudgetEvaluation } from '../types/pricing';
import type { OrderBreakdown } from '../types/pricing';
import type { ExceededSnapshot } from '../types/state';

beforeEach(() => { cleanup(); });

describe('Button', () => {
  it('renders children and responds to click', () => {
    let clicked = false;
    const { container } = render(<Button onClick={() => { clicked = true; }}>Test</Button>);
    const btn = container.querySelector('button');
    expect(btn).not.toBeNull();
    expect(btn?.textContent).toBe('Test');
    click(btn);
    expect(clicked).toBe(true);
  });

  it('aria-disabled prevents click', () => {
    let clicked = false;
    const { container } = render(<Button ariaDisabled onClick={() => { clicked = true; }}>Disabled</Button>);
    const btn = container.querySelector('button');
    expect(btn?.getAttribute('aria-disabled')).toBe('true');
    click(btn);
    expect(clicked).toBe(false);
  });

  it('does not set HTML disabled attribute when aria-disabled', () => {
    const { container } = render(<Button ariaDisabled>Disabled</Button>);
    const btn = container.querySelector('button');
    expect(btn?.hasAttribute('disabled')).toBe(false);
  });
});

describe('Toggle', () => {
  it('reflects aria-checked state', () => {
    const { container } = render(<Toggle checked={false} label="Sesuai Budget Saya" onChange={() => {}} />);
    const sw = container.querySelector('[role="switch"]');
    expect(sw?.getAttribute('aria-checked')).toBe('false');
  });

  it('aria-disabled prevents click', () => {
    let changed = false;
    const { container } = render(<Toggle checked={false} ariaDisabled label="Test" onChange={() => { changed = true; }} />);
    const sw = container.querySelector('[role="switch"]');
    expect(sw?.getAttribute('aria-disabled')).toBe('true');
    click(sw);
    expect(changed).toBe(false);
  });
});

describe('QuantityStepper', () => {
  it('decrement button has remove aria-label at qty=1', () => {
    const { container } = render(
      <QuantityStepper qty={1} itemName="Ayam Bakar" onIncrement={() => {}} onDecrement={() => {}} />,
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[0]?.getAttribute('aria-label')).toContain('Hapus Ayam Bakar dari keranjang');
  });

  it('decrement button has decrease aria-label at qty>1', () => {
    const { container } = render(
      <QuantityStepper qty={3} itemName="Ayam Bakar" onIncrement={() => {}} onDecrement={() => {}} />,
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[0]?.getAttribute('aria-label')).toBe('Kurangi jumlah Ayam Bakar');
  });

  it('increment button has aria-disabled at qty=99', () => {
    const { container } = render(
      <QuantityStepper qty={99} itemName="Test" onIncrement={() => {}} onDecrement={() => {}} />,
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[1]?.getAttribute('aria-disabled')).toBe('true');
  });

  it('increment button is not HTML disabled at qty=99', () => {
    const { container } = render(
      <QuantityStepper qty={99} itemName="Test" onIncrement={() => {}} onDecrement={() => {}} />,
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[1]?.hasAttribute('disabled')).toBe(false);
  });
});

describe('PriceNote', () => {
  it('renders two block lines with correct text', () => {
    const { container } = render(
      <PriceNote taxStatus="NOT_INCLUDED" packagingFee={2000} estimateAllIn={47200} onOpenInfo={() => {}} />,
    );
    const btn = container.querySelector('button');
    expect(btn?.getAttribute('aria-haspopup')).toBe('dialog');
    const spans = btn?.querySelectorAll('span.block, span.flex');
    expect(spans?.length).toBeGreaterThanOrEqual(2);
    expect(btn?.textContent).toContain('Belum termasuk pajak 10% + kemasan');
    expect(btn?.textContent).toContain('Est. all-in 1 porsi: Rp47.200.');
  });

  it('has sr-only text for accessible name', () => {
    const { container } = render(
      <PriceNote taxStatus="INCLUDED" packagingFee={1000} estimateAllIn={20000} onOpenInfo={() => {}} />,
    );
    const sr = container.querySelector('.sr-only');
    expect(sr?.textContent).toContain('Buka penjelasan komponen biaya.');
  });
});

describe('BudgetTracker', () => {
  function makeEval(overrides: Partial<BudgetEvaluation> = {}): BudgetEvaluation {
    return {
      budget: 50000, projection: 40000, status: 'WARN', leftover: 10000, exceededBy: 0,
      barPercent: 80, percentLabel: '80%', ...overrides,
    };
  }

  it('has persistent live region role=status', () => {
    const { container } = render(<BudgetTracker evaluation={makeEval()} />);
    const live = container.querySelector('[role="status"]');
    expect(live).not.toBeNull();
    expect(live?.getAttribute('aria-live')).toBe('polite');
  });

  it('live region text includes label and percentage', () => {
    const { container } = render(<BudgetTracker evaluation={makeEval({ status: 'WARN', percentLabel: '80%' })} />);
    const live = container.querySelector('[role="status"]');
    expect(live?.textContent).toContain('Mepet budget');
    expect(live?.textContent).toContain('80 persen');
  });

  it('has progressbar with aria-valuenow', () => {
    const { container } = render(<BudgetTracker evaluation={makeEval({ barPercent: 80 })} />);
    const pb = container.querySelector('[role="progressbar"]');
    expect(pb?.getAttribute('aria-valuenow')).toBe('80');
    expect(pb?.getAttribute('aria-valuemin')).toBe('0');
    expect(pb?.getAttribute('aria-valuemax')).toBe('100');
  });
});

describe('PriceBreakdown', () => {
  function makeBreakdown(overrides: Partial<OrderBreakdown> = {}): OrderBreakdown {
    return {
      isEmpty: false, itemCount: 1, subtotal: 30000, taxableSubtotal: 30000, tax: 3000, packaging: 2000,
      deliveryFee: 12000, baseDeliveryFee: 12000, addressDeliveryDelta: 0, serviceFee: 3000,
      foodDiscount: 0, deliveryDiscount: 0, total: 50000,
      appliedFoodVoucher: null, appliedDeliveryVoucher: null, rejectedVouchers: [],
      ...overrides,
    };
  }

  it('renders rows in correct order', () => {
    const { container } = render(<PriceBreakdown breakdown={makeBreakdown()} />);
    const dts = container.querySelectorAll('dt');
    expect(dts[0]?.textContent).toBe('Subtotal item');
    expect(dts[1]?.textContent).toBe('Pajak restoran (10%)');
    expect(dts[2]?.textContent).toBe('Biaya kemasan');
    expect(dts[3]?.textContent).toBe('Ongkos kirim');
    expect(dts[4]?.textContent).toBe('Biaya layanan');
    expect(dts[5]?.textContent).toBe('Diskon voucher makanan');
    expect(dts[6]?.textContent).toBe('Diskon voucher ongkir');
  });

  it('shows TOTAL row', () => {
    const { container } = render(<PriceBreakdown breakdown={makeBreakdown()} />);
    const total = byText(container, 'TOTAL');
    expect(total).not.toBeNull();
  });

  it('inactive discount shows minus Rp0', () => {
    const { container } = render(<PriceBreakdown breakdown={makeBreakdown({ foodDiscount: 0 })} />);
    const dds = container.querySelectorAll('dd');
    expect(dds[5]?.textContent).toBe('\u2212Rp0');
  });
});

describe('NoticeBanner', () => {
  it('has role=status and aria-live=polite', () => {
    const { container } = render(<NoticeBanner variant="warning" messages={['Test message']} />);
    const banner = container.querySelector('[role="status"]');
    expect(banner).not.toBeNull();
    expect(banner?.getAttribute('aria-live')).toBe('polite');
  });

  it('renders message text', () => {
    const { container } = render(<NoticeBanner variant="success" messages={['Voucher diganti']} />);
    expect(container.textContent).toContain('Voucher diganti');
  });
});

describe('Thumbnail', () => {
  it('has aria-hidden=true', () => {
    const { container } = render(<Thumbnail variant="restaurant" emoji="X" gradient="from-orange-100 to-orange-200" />);
    const div = container.querySelector('div');
    expect(div?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders emoji content', () => {
    const { container } = render(<Thumbnail variant="menu" emoji="Y" gradient="from-stone-100 to-stone-200" />);
    expect(container.textContent).toContain('Y');
  });
});

describe('BudgetExceededDialog', () => {
  function makeSnapshot(overrides: Partial<ExceededSnapshot> = {}): ExceededSnapshot {
    return { budget: 50000, spentToday: 12000, expectedTotal: 50000, projection: 62000, exceededBy: 12000, ...overrides };
  }

  it('initial focus is NOT on Lanjutkan tetap button', () => {
    render(
      <BudgetExceededDialog
        open={true}
        snapshot={makeSnapshot()}
        onChangeOrder={() => {}}
        onShowAffordable={() => {}}
        onContinue={() => {}}
        titleId="exceeded-title"
      />,
    );
    const initialFocus = document.querySelector('[data-initial-focus]');
    expect(initialFocus).not.toBeNull();
    expect(initialFocus?.textContent).not.toContain('Lanjutkan tetap');
    expect(initialFocus?.textContent).toContain('Ubah pesanan');
  });

  it('has alertdialog role', () => {
    render(
      <BudgetExceededDialog
        open={true}
        snapshot={makeSnapshot()}
        onChangeOrder={() => {}}
        onShowAffordable={() => {}}
        onContinue={() => {}}
        titleId="exceeded-title"
      />,
    );
    const dialog = document.querySelector('[role="alertdialog"]');
    expect(dialog).not.toBeNull();
  });

  it('shows three action buttons in correct order', () => {
    render(
      <BudgetExceededDialog
        open={true}
        snapshot={makeSnapshot()}
        onChangeOrder={() => {}}
        onShowAffordable={() => {}}
        onContinue={() => {}}
        titleId="exceeded-title"
      />,
    );
    const overlay = document.getElementById('overlay-root');
    const buttons = overlay?.querySelectorAll('button') ?? [];
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).toContain('Ubah pesanan');
    expect(texts).toContain('Lihat yang sesuai budget');
    expect(texts).toContain('Lanjutkan tetap');
    const changeIdx = texts.indexOf('Ubah pesanan');
    const affordableIdx = texts.indexOf('Lihat yang sesuai budget');
    const continueIdx = texts.indexOf('Lanjutkan tetap');
    expect(changeIdx).toBeLessThan(affordableIdx);
    expect(affordableIdx).toBeLessThan(continueIdx);
  });
});
