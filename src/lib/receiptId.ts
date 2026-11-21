export type ReceiptIdGenerator = () => string;

export function createReceiptId(generate: ReceiptIdGenerator): string {
  return 'RCPT-' + generate();
}
