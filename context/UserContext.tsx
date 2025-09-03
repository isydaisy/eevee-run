"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, GoogleAuthProvider } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface User {
    uid: string;
    displayName: string;
    isGuest?: boolean;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Firebase Auth 상태 감지
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName || "Google User",
                    isGuest: false, // 구글 로그인
                });
            } else {
                // Firebase 로그아웃 상태면 user는 null
                setUser((prev) => (prev?.isGuest ? prev : null));
            }
        });

        return () => unsubscribe();
    }, []);

    // 새로고침 후 게스트 로그인 유지
    useEffect(() => {
        const savedGuest = localStorage.getItem("guestUser");
        if (savedGuest) {
            setUser(JSON.parse(savedGuest));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
