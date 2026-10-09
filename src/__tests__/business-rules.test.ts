import { describe, it, expect } from 'vitest';

// 1. Minimum Order Subtotal Validation
export function validateMinimumOrder(subtotal: number, minRequired = 20.00): boolean {
  return subtotal >= minRequired;
}

// 2. Minimum Consumption Calculation
export function calculateMinimumConsumption(guestCount: number, perPersonAmount: number): number {
  if (guestCount < 1 || perPersonAmount < 0) return 0;
  return guestCount * perPersonAmount;
}

// 3. Authorized Outside Food Fee Calculation
export function calculateOutsideFoodFee(guestCount: number, feePerPerson = 15.00, isAuthorized = true): number {
  if (!isAuthorized || guestCount < 1) return 0;
  return guestCount * feePerPerson;
}

// 4. Booking Time Overlap Check Logic
export function checkBookingOverlap(
  existingStart: string,
  existingEnd: string,
  newStart: string,
  newEnd: string
): boolean {
  // Convert "HH:MM" to minutes for comparison
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const eStart = toMinutes(existingStart);
  const eEnd = toMinutes(existingEnd);
  const nStart = toMinutes(newStart);
  const nEnd = toMinutes(newEnd);

  // Overlap condition: (StartA < EndB) and (EndA > StartB)
  return nStart < eEnd && nEnd > eStart;
}

// 5. Recipe Ingredient Deduction Logic
export function deductIngredientStock(currentStock: number, deductAmount: number): number {
  const remaining = currentStock - deductAmount;
  if (remaining < 0) {
    throw new Error('Negative stock not allowed without special authorization');
  }
  return Number(remaining.toFixed(3));
}

// Vitest Test Suite
describe('El Villa Business Rules & Financial Calculations', () => {
  it('validates minimum order subtotal of 20 EGP', () => {
    expect(validateMinimumOrder(15.00, 20.00)).toBe(false);
    expect(validateMinimumOrder(20.00, 20.00)).toBe(true);
    expect(validateMinimumOrder(50.00, 20.00)).toBe(true);
  });

  it('calculates minimum consumption required based on guest count', () => {
    expect(calculateMinimumConsumption(4, 50.00)).toBe(200.00);
    expect(calculateMinimumConsumption(6, 0.00)).toBe(0.00);
  });

  it('calculates outside food fee of 15 EGP per person when authorized', () => {
    expect(calculateOutsideFoodFee(3, 15.00, true)).toBe(45.00);
    expect(calculateOutsideFoodFee(3, 15.00, false)).toBe(0.00);
  });

  it('detects hall booking time overlaps accurately', () => {
    // Existing: 16:00 to 20:00
    // Overlapping: 18:00 to 22:00 -> should return true (overlap)
    expect(checkBookingOverlap('16:00', '20:00', '18:00', '22:00')).toBe(true);

    // Non-overlapping: 20:00 to 23:00 -> should return false (no overlap)
    expect(checkBookingOverlap('16:00', '20:00', '20:00', '23:00')).toBe(false);
  });

  it('deducts ingredient stock without allowing negative balance', () => {
    expect(deductIngredientStock(5.5, 2.0)).toBe(3.5);
    expect(() => deductIngredientStock(1.0, 2.0)).toThrow('Negative stock not allowed');
  });
});
