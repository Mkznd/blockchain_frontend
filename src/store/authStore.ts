import {create} from "zustand";

interface AuthState {
    token: string | null;
    isLoggedIn: boolean;
    login: (jwtToken: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isLoggedIn: false,
    login: (jwtToken: string) =>
        set({ token: jwtToken, isLoggedIn: true }),
    logout: () =>
        set({ token: null, isLoggedIn: false }),
}));

export default useAuthStore;
