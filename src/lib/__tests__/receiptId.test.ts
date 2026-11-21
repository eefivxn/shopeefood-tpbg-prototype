import { describe, it, expect } from 'vitest';
import { createReceiptId } from '../../lib/receiptId';

describe('createReceiptId', () => {
  it('prefixes RCPT- to injected generator output', () => {
    const gen = (): string => '0001-ABC';
    expect(createReceiptId(gen)).toBe('RCPT-0001-ABC');
  });

  it('is pure — does not use crypto or Date.now', () => {
    let counter = 0;
    const gen = (): string => {
      counter += 1;
      return String(counter).padStart(4, '0');
    };
    expect(createReceiptId(gen)).toBe('RCPT-0001');
    expect(createReceiptId(gen)).toBe('RCPT-0002');
  });
});
