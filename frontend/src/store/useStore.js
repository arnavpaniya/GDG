import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  chats: [],
  currentChatId: null,
  isSidebarOpen: true,
  messages: [],
  isSettingsOpen: false,
  theme: typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light',
  
  // Actions
  setUser: (user) => set({ user }),
  setChats: (chats) => set({ chats }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setCurrentChatId: (id) => set({ currentChatId: id }),
  setMessages: (messages) => set({ messages }),
  setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
}));

export default useStore;
