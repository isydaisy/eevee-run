"use client";

import { useRouter } from "next/navigation";
import { auth, GoogleAuthProvider, signInWithPopup } from "@/firebase/firebase";
import { useUser } from "@/context/UserContext";

export default function LoginButtons() {
    const router = useRouter();
    const { setUser } = useUser();

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setUser({ uid: user.uid, displayName: user.displayName || "Google User" });
            router.push("/game");
        } catch (err) {
            console.error(err);
        }
    };

    const handleGuestLogin = () => {
        router.push("/game");
    };

    return (
        <div className="flex flex-col space-y-4 w-full max-w-xs mx-auto ">
            <button onClick={handleGoogleLogin} className="bg-yellow-800 text-white py-2 rounded hover:bg-yellow-900 hover:cursor-pointer">
                Google 로그인
            </button>
            <button onClick={handleGuestLogin} className="bg-green-400 text-white py-2 rounded hover:bg-green-500 hover:cursor-pointer">
                게스트 로그인
            </button>
        </div>
    );
}
