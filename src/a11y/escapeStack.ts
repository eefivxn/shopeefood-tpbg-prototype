export interface EscapeLayer {
  readonly id: string;
  readonly onEscape: () => void;
}

const layers: EscapeLayer[] = [];
let listening = false;

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || event.isComposing || event.defaultPrevented) return;
  const top = layers[layers.length - 1];
  if (top === undefined) return;
  event.preventDefault();
  top.onEscape();
}

export function pushEscapeLayer(layer: EscapeLayer): () => void {
  layers.push(layer);
  if (!listening) {
    document.addEventListener('keydown', handleKeyDown);
    listening = true;
  }
  return () => {
    const index = layers.indexOf(layer);
    if (index >= 0) layers.splice(index, 1);
    if (layers.length === 0 && listening) {
      document.removeEventListener('keydown', handleKeyDown);
      listening = false;
    }
  };
}
