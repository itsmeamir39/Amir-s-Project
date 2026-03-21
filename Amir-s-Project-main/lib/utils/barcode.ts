import JsBarcode from 'jsbarcode';

/**
 * Generate a Base64-encoded PNG barcode image from a string value.
 * Intended for browser usage (relies on document.createElement('canvas')).
 */
export function generateBarcodeDataUrl(
  value: string,
  options?: JsBarcode.Options
): string {
  if (typeof document === 'undefined') {
    throw new Error(
      'generateBarcodeDataUrl must be called in a browser environment.'
    );
  }

  const canvas = document.createElement('canvas');

  JsBarcode(canvas, value, {
    format: 'CODE128',
    displayValue: false,
    margin: 8,
    ...options,
  });

  return canvas.toDataURL('image/png');
}

