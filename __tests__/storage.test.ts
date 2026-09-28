import { StorageService, DEFAULT_PROFILE, DEFAULT_SETTINGS } from '../services/storage';

describe('StorageService', () => {
  it('should return default profile when storage is empty', async () => {
    const profile = await StorageService.getProfile();
    expect(profile.name).toBe(DEFAULT_PROFILE.name);
    expect(profile.email).toBe(DEFAULT_PROFILE.email);
    expect(profile.university).toBe(DEFAULT_PROFILE.university);
  });

  it('should return default settings when storage is empty', async () => {
    const settings = await StorageService.getSettings();
    expect(settings.notificationsEnabled).toBe(DEFAULT_SETTINGS.notificationsEnabled);
    expect(settings.soundEnabled).toBe(DEFAULT_SETTINGS.soundEnabled);
    expect(settings.offlineSync).toBe(DEFAULT_SETTINGS.offlineSync);
    expect(settings.language).toBe(DEFAULT_SETTINGS.language);
  });

  it('should save and retrieve updated profile fields', async () => {
    const updated = await StorageService.saveProfile({
      name: 'Maria Curie',
      major: 'Applied Physics',
    });
    expect(updated.name).toBe('Maria Curie');
    expect(updated.major).toBe('Applied Physics');
    expect(updated.university).toBe(DEFAULT_PROFILE.university);

    const retrieved = await StorageService.getProfile();
    expect(retrieved.name).toBe('Maria Curie');
  });

  it('should add, retrieve, and delete scheduled study sessions', async () => {
    const session = await StorageService.addSession({
      name: 'Mechanics Lab Review',
      subject: 'Physics',
      durationHours: 2,
      durationMinutes: 0,
      mode: 'individual',
      notes: 'Review friction and work-energy formulas',
    });

    expect(session.id).toBeDefined();
    expect(session.name).toBe('Mechanics Lab Review');

    const sessions = await StorageService.getSessions();
    expect(sessions.some((s) => s.id === session.id)).toBe(true);

    await StorageService.deleteSession(session.id);
    const afterDelete = await StorageService.getSessions();
    expect(afterDelete.some((s) => s.id === session.id)).toBe(false);
  });

  it('should record quiz activity completion', async () => {
    const activity = await StorageService.saveActivity({
      routeId: '1',
      title: 'Mathematics Mastery Quiz',
      subject: 'Mathematics',
      duration: '15 mins',
      date: 'Today',
      score: '5/5',
    });

    expect(activity.id).toBeDefined();
    expect(activity.score).toBe('5/5');

    const all = await StorageService.getActivities();
    expect(all.length).toBeGreaterThanOrEqual(1);
    expect(all[0].title).toBe('Mathematics Mastery Quiz');
  });

  it('should save and clear Gemini API key', async () => {
    await StorageService.saveGeminiApiKey('test-gemini-key-12345');
    const key = await StorageService.getGeminiApiKey();
    expect(key).toBe('test-gemini-key-12345');

    await StorageService.clearGeminiApiKey();
    const cleared = await StorageService.getGeminiApiKey();
    expect(cleared).not.toBe('test-gemini-key-12345');
  });
});
