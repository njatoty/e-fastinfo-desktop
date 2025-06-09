import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  if (
    value &&
    typeof value === 'object' &&
    'd' in value &&
    Array.isArray(value.d)
  ) {
    const { d, e, s } = value as any;

    // Join digits into full number string
    const digitsStr = d.join('');

    // Calculate where the decimal point should be
    const decimalIndex = e + 1;

    let fullNumberStr = '';
    if (decimalIndex >= digitsStr.length) {
      // No decimal part needed — pad with zeros
      fullNumberStr = digitsStr.padEnd(decimalIndex, '0');
    } else if (decimalIndex <= 0) {
      // All digits are after the decimal point
      fullNumberStr = '0.' + '0'.repeat(-decimalIndex) + digitsStr;
    } else {
      // Insert decimal point into the string
      fullNumberStr =
        digitsStr.slice(0, decimalIndex) + '.' + digitsStr.slice(decimalIndex);
    }

    return s * parseFloat(fullNumberStr);
  }
  return 0; // fallback if undefined/null
}
