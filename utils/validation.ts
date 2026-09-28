export const ValidationUtils = {
  validateEmail(email: string): boolean {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  },

  validatePassword(password: string): { isValid: boolean; error?: string } {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters' };
    }
    return { isValid: true };
  },

  formatDuration(hours: number, minutes: number): string {
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.length > 0 ? parts.join(' ') : '0m';
  },

  formatSeconds(totalSeconds: number): string {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  calculateQuizScore(
    userAnswers: Record<number, string>,
    questions: { id: string; correctAnswer: string }[]
  ): { score: number; total: number; percentage: number } {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    const total = questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    return { score, total, percentage };
  },

  formatDateHeader(dateStr: string): string {
    if (!dateStr) return '';
    if (['Today', 'Yesterday', 'Recently Completed'].includes(dateStr) || dateStr.toLowerCase().includes('ago')) {
      return dateStr;
    }
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      return dateStr;
    }
    return parsed.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  },

  formatDateShort(dateStr: string): string {
    if (!dateStr) return '';
    if (['Today', 'Yesterday', 'Recently Completed'].includes(dateStr) || dateStr.toLowerCase().includes('ago')) {
      return dateStr;
    }
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      return dateStr;
    }
    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  },
};
