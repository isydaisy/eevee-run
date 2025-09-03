"use client";

import { useUser } from "@/context/UserContext";
import GameCanvas from "@/components/GameCanvas";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Retry from '@/assets/icon/re-try-fill.svg';

export default function GamePage() {
    const { user, setUser } = useUser();
    const router = useRouter();
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameKey, setGameKey] = useState(0);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
        setUser(null);
        localStorage.removeItem("guestUser");
        router.push("/");
    };

    const handleRestart = () => {
        setIsGameOver(false);
        setElapsedTime(0);
        setGameKey(prev => prev + 1);
    };

    const goToLeaderboard = () => {
        router.push("/leaderboard");
    };

    return (
        <div className="p-4 w-full px-[5%]" style={{ backgroundColor: '#F5E1C8', minHeight: '100vh' }}>
            <div className="mb-4 text-right">
                <p style={{ color: '#8B5E3C', fontWeight: '500' }}>
                    { user && user?.displayName || "Guest"} 접속중
                    <button
                        onClick={handleLogout}
                        className="ml-3 px-2 py-1 rounded hover:cursor-pointer"
                        style={{
                            backgroundColor: '#A67C52',
                            color: 'white'
                        }}
                    >
                        {user ? "로그아웃" : "로그인"}
                    </button>
                </p>
            </div>

            <div className='flex gap-5 items-center text-xl font-semibold' style={{ color: '#8B5E3C' }}>
                {(elapsedTime / 1000).toFixed(2)}s
                {isGameOver && (
                    <div onClick={handleRestart} className='w-fit flex gap-1 items-center hover:cursor-pointer'>
                        <p>다시하기</p>
                        <Retry width="20" height="20"/>
                    </div>
                )}
            </div>

            <div className="my-6">
                <GameCanvas
                    key={gameKey}
                    onTimeUpdate={(seconds) => setElapsedTime(seconds)}
                    onGameOver={setIsGameOver}
                />
            </div>

            <div className="w-full text-center mt-10 text-lg" style={{ color: '#8B5E3C' }}>
                <p className="font-semibold">이브이는 지금 더 놀고 싶다!</p>
                <p className="font-semibold">몬스터볼에 잡히지 않도록 도와주자</p>
                <div className="text-sm mt-6" style={{ color: '#A67C52' }}>
                    <p>PC 점프 : 스페이스바</p>
                    <p>모바일 점프 : 터치</p>
                    <p>게스트 로그인은 기록이 남지 않습니다.</p>
                </div>
                <button
                    onClick={goToLeaderboard}
                    className="mt-10 px-6 py-2 rounded hover:opacity-90 font-semibold hover:cursor-pointer"
                    style={{
                        backgroundColor: '#8B5E3C',
                        color: '#FFF3E0'
                    }}
                >
                    랭킹 확인
                </button>
            </div>
        </div>
    );
}
