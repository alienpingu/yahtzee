import { create } from 'zustand';

const SETTINGS_KEY = 'yatzy_settings';

function loadSettings() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSettings(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      autofocusOn: state.autofocusOn,
      soundOn: state.soundOn,
      reduceMotion: state.reduceMotion,
    }));
  } catch {}
}

export const useSettings = create((set, get) => {
  const saved = typeof window !== 'undefined' ? loadSettings() : null;
  return {
    autofocusOn: saved?.autofocusOn ?? true,
    soundOn: saved?.soundOn ?? true,
    reduceMotion: saved?.reduceMotion ?? false,

    setAutofocus: (v) => { set({ autofocusOn: v }); persistSettings(get()); },
    setSound: (v) => { set({ soundOn: v }); persistSettings(get()); },
    setReduceMotion: (v) => { set({ reduceMotion: v }); persistSettings(get()); },
  };
});

export const useUiStore = create((set) => ({
  activeTabId: null,
  setActiveTab: (id) => set({ activeTabId: id }),

  lastYatzyEvent: null,
  fireYatzy: (playerId, player) => set({
    lastYatzyEvent: { playerId, player, ts: Date.now() },
  }),
  clearYatzy: () => set({ lastYatzyEvent: null }),

  passDeviceVisible: false,
  showPassDevice: () => set({ passDeviceVisible: true }),
  hidePassDevice: () => set({ passDeviceVisible: false }),
}));
