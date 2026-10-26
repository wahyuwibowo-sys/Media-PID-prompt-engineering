import { PromptHistoryItem, RTCLForm, OutputFormat, StudentProfile } from '../types/rtcl';

const HISTORY_KEY = 'rtcl_prompt_history_v1';
const THEME_KEY = 'rtcl_theme_mode';
const STUDENT_KEY = 'rtcl_student_profile_v1';
const MAX_HISTORY = 20;

export function loadStudentProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    if (!raw) {
      return {
        name: '',
        className: 'X APHPi 1',
        attendanceNumber: '',
        schoolName: 'SMK Negeri 1 Sidayu'
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      name: '',
      className: 'X APHPi 1',
      attendanceNumber: '',
      schoolName: 'SMK Negeri 1 Sidayu'
    };
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save student profile:', error);
  }
}

export function loadHistory(): PromptHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load history from localStorage:', error);
    return [];
  }
}

export function saveHistoryItem(data: RTCLForm, format: OutputFormat, preview: string, categoryTag?: string): PromptHistoryItem[] {
  try {
    const history = loadHistory();
    const newItem: PromptHistoryItem = {
      id: `prompt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      data,
      format,
      preview,
      categoryTag
    };

    // Filter out duplicates with exact same text if consecutive
    const filtered = history.filter(
      item => !(item.data.role === data.role && item.data.task === data.task && item.data.context === data.context)
    );

    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save prompt to history:', error);
    return [];
  }
}

export function deleteHistoryItem(id: string): PromptHistoryItem[] {
  try {
    const history = loadHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to delete history item:', error);
    return [];
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}
