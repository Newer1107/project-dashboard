"use client";

import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  notificationPanelOpen: boolean;
  setNotificationPanelOpen: (open: boolean) => void;
  modalOpen: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  notificationPanelOpen: false,
  setNotificationPanelOpen: (open) => set({ notificationPanelOpen: open }),
  modalOpen: null,
  openModal: (id) => set({ modalOpen: id }),
  closeModal: () => set({ modalOpen: null }),
}));
