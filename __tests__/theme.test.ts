import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

describe('Theme Constants', () => {
  it('should define consistent light and dark palettes', () => {
    const requiredKeys: (keyof typeof Colors.light)[] = [
      'primary',
      'background',
      'cardBackground',
      'surface',
      'text',
      'secondaryText',
      'border',
    ];

    requiredKeys.forEach((key) => {
      expect(Colors.light[key]).toBeDefined();
      expect(Colors.dark[key]).toBeDefined();
    });
  });

  it('should have valid typography definitions with numeric sizes', () => {
    expect(Typography.h1.fontSize).toBeGreaterThan(Typography.h2.fontSize);
    expect(Typography.h2.fontSize).toBeGreaterThan(Typography.h3.fontSize);
    expect(Typography.bodyLarge.fontSize).toBeGreaterThan(Typography.body.fontSize);
    expect(Typography.body.fontSize).toBeGreaterThan(Typography.caption.fontSize);
  });

  it('should have ascending spacing scale', () => {
    expect(Spacing.xs).toBeLessThan(Spacing.sm);
    expect(Spacing.sm).toBeLessThan(Spacing.md);
    expect(Spacing.md).toBeLessThan(Spacing.lg);
    expect(Spacing.lg).toBeLessThan(Spacing.xl);
    expect(Spacing.xl).toBeLessThan(Spacing.xxl);
  });

  it('should have distinct border radius settings', () => {
    expect(BorderRadius.sm).toBeLessThan(BorderRadius.md);
    expect(BorderRadius.md).toBeLessThan(BorderRadius.lg);
    expect(BorderRadius.lg).toBeLessThan(BorderRadius.xl);
    expect(BorderRadius.full).toBe(9999);
  });
});
