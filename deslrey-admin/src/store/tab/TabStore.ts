import { create } from 'zustand';

export interface TabItem {
  id: string;
  path: string;
  search: string;
  label: string;
  closable: boolean;
}

interface TabState {
  tabs: TabItem[];
  activeTabId: string | null;
  addOrActivateTab: (path: string, search: string, label: string, closable?: boolean) => string;
  removeTab: (id: string) => void;
  removeOthers: (keepId: string) => void;
  removeLeft: (targetId: string) => void;
  removeAll: () => void;
  setActiveTabId: (id: string) => void;
  getTabId: (path: string, search: string) => string;
}

export const getTabId = (path: string, search: string) => {
  const s = search?.trim();
  return s ? `${path}${s.startsWith('?') ? s : '?' + s}` : path;
};

const initialHomeTab: TabItem = {
  id: 'home',
  path: 'home',
  search: '',
  label: '主页',
  closable: false,
};

export const useTabStore = create<TabState>((set) => ({
  tabs: [initialHomeTab],
  activeTabId: 'home',

  getTabId,

  addOrActivateTab: (path, search, label, closable = true) => {
    const id = getTabId(path, search);
    set((state) => {
      const exists = state.tabs.some((t) => t.id === id);
      if (exists) {
        if (state.activeTabId === id) return state;
        return { ...state, activeTabId: id };
      }
      const closableVal = closable ?? path !== 'home';
      const newTab: TabItem = {
        id,
        path,
        search: search?.trim() || '',
        label,
        closable: closableVal,
      };
      return {
        tabs: [...state.tabs, newTab],
        activeTabId: id,
      };
    });
    return id;
  },

  removeTab: (id) => {
    set((state) => {
      const target = state.tabs.find((t) => t.id === id);
      if (target?.path === 'home') return state;
      const list = state.tabs.filter((t) => t.id !== id);
      const wasActive = state.activeTabId === id;
      let nextActive = state.activeTabId;
      if (wasActive && list.length) {
        const idx = state.tabs.findIndex((t) => t.id === id);
        nextActive = idx > 0 ? state.tabs[idx - 1].id : list[0].id;
      }
      if (!list.length) nextActive = null;
      return { tabs: list, activeTabId: nextActive };
    });
  },

  removeOthers: (keepId) => {
    set((state) => {
      const keep = state.tabs.filter((t) => t.id === keepId || t.path === 'home');
      return { tabs: keep, activeTabId: keepId };
    });
  },

  removeLeft: (targetId) => {
    set((state) => {
      const idx = state.tabs.findIndex((t) => t.id === targetId);
      if (idx <= 0) return state;
      const home = state.tabs.find((t) => t.path === 'home');
      const right = state.tabs.filter((_, i) => i >= idx);
      const hasHome = right.some((t) => t.path === 'home');
      const list = home && !hasHome ? [home, ...right] : right;
      const wasActive = state.activeTabId === targetId;
      return { tabs: list, activeTabId: wasActive ? targetId : state.activeTabId };
    });
  },

  removeAll: () => {
    set((state) => {
      const home = state.tabs.find((t) => t.path === 'home') ?? initialHomeTab;
      return { tabs: [home], activeTabId: home.id };
    });
  },

  setActiveTabId: (id) => set({ activeTabId: id }),
}));
