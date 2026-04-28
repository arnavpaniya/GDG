import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  chats: [],
  currentChatId: null,
  isSidebarOpen: true,
  messages: [],
  isSettingsOpen: false,
  theme: typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark',
  
  // Actions
  setUser: (user) => set({ user }),
  setChats: (chats) => set({ chats }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setCurrentChatId: (id) => set({ currentChatId: id }),
  setMessages: (messages) => set((state) => ({
    messages: typeof messages === 'function'
      ? messages(Array.isArray(state.messages) ? state.messages : [])
      : (Array.isArray(messages) ? messages : []),
  })),
  setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  removeChat: (chatId) => set((state) => ({ 
    chats: state.chats.filter(c => c.id !== chatId) 
  })),
  clearChats: () => set({ chats: [], currentChatId: null, messages: [] }),
}));

export default useStore;
