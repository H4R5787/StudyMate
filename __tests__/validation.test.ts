import { ValidationUtils } from '../utils/validation';

describe('ValidationUtils', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(ValidationUtils.validateEmail('user@example.com')).toBe(true);
      expect(ValidationUtils.validateEmail('student.alex@stanford.edu')).toBe(true);
      expect(ValidationUtils.validateEmail('contact+tag@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(ValidationUtils.validateEmail('')).toBe(false);
      expect(ValidationUtils.validateEmail('plainaddress')).toBe(false);
      expect(ValidationUtils.validateEmail('@missingusername.com')).toBe(false);
      expect(ValidationUtils.validateEmail('username@.com')).toBe(false);
      expect(ValidationUtils.validateEmail('user@domain')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept passwords with 6 or more characters', () => {
      const res = ValidationUtils.validatePassword('123456');
      expect(res.isValid).toBe(true);
      expect(res.error).toBeUndefined();
    });

    it('should reject passwords shorter than 6 characters', () => {
      const res = ValidationUtils.validatePassword('12345');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('6 characters');
    });

    it('should reject empty passwords', () => {
      const res = ValidationUtils.validatePassword('');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('required');
    });
  });

  describe('formatDuration', () => {
    it('should format hours and minutes correctly', () => {
      expect(ValidationUtils.formatDuration(2, 30)).toBe('2h 30m');
      expect(ValidationUtils.formatDuration(1, 0)).toBe('1h');
      expect(ValidationUtils.formatDuration(0, 45)).toBe('45m');
      expect(ValidationUtils.formatDuration(0, 0)).toBe('0m');
    });
  });

  describe('formatSeconds', () => {
    it('should format total seconds as mm:ss', () => {
      expect(ValidationUtils.formatSeconds(1500)).toBe('25:00');
      expect(ValidationUtils.formatSeconds(300)).toBe('05:00');
      expect(ValidationUtils.formatSeconds(65)).toBe('01:05');
      expect(ValidationUtils.formatSeconds(0)).toBe('00:00');
      expect(ValidationUtils.formatSeconds(-10)).toBe('00:00');
    });
  });

  describe('calculateQuizScore', () => {
    const sampleQuestions = [
      { id: '1', correctAnswer: '3.14' },
      { id: '2', correctAnswer: '5' },
      { id: '3', correctAnswer: '40 cm²' },
      { id: '4', correctAnswer: '76' },
    ];

    it('should accurately tally perfect scores', () => {
      const userAnswers = { 0: '3.14', 1: '5', 2: '40 cm²', 3: '76' };
      const result = ValidationUtils.calculateQuizScore(userAnswers, sampleQuestions);
      expect(result.score).toBe(4);
      expect(result.total).toBe(4);
      expect(result.percentage).toBe(100);
    });

    it('should accurately tally partial scores', () => {
      const userAnswers = { 0: '3.14', 1: 'WRONG', 2: '40 cm²', 3: 'WRONG' };
      const result = ValidationUtils.calculateQuizScore(userAnswers, sampleQuestions);
      expect(result.score).toBe(2);
      expect(result.total).toBe(4);
      expect(result.percentage).toBe(50);
    });

    it('should handle empty answers gracefully', () => {
      const result = ValidationUtils.calculateQuizScore({}, sampleQuestions);
      expect(result.score).toBe(0);
      expect(result.total).toBe(4);
      expect(result.percentage).toBe(0);
    });
  });

  describe('formatDateHeader', () => {
    it('should return relative labels unchanged', () => {
      expect(ValidationUtils.formatDateHeader('Today')).toBe('Today');
      expect(ValidationUtils.formatDateHeader('Yesterday')).toBe('Yesterday');
      expect(ValidationUtils.formatDateHeader('Recently Completed')).toBe('Recently Completed');
      expect(ValidationUtils.formatDateHeader('3 Days Ago')).toBe('3 Days Ago');
    });

    it('should format ISO date strings properly', () => {
      const formatted = ValidationUtils.formatDateHeader('2026-09-28');
      expect(formatted).toContain('Sep');
      expect(formatted).toContain('28');
    });

    it('should return empty string for empty input', () => {
      expect(ValidationUtils.formatDateHeader('')).toBe('');
    });
  });

  describe('formatDateShort', () => {
    it('should return relative labels unchanged', () => {
      expect(ValidationUtils.formatDateShort('Today')).toBe('Today');
      expect(ValidationUtils.formatDateShort('Yesterday')).toBe('Yesterday');
      expect(ValidationUtils.formatDateShort('2 days ago')).toBe('2 days ago');
    });

    it('should format ISO date strings to short month and day', () => {
      const formatted = ValidationUtils.formatDateShort('2026-09-28');
      expect(formatted).toBe('Sep 28');
    });

    it('should return empty string for empty input', () => {
      expect(ValidationUtils.formatDateShort('')).toBe('');
    });
  });
});

