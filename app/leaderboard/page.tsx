"use client";

import { useEffect, useState } from "react";
import {db} from "@/firebase/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface UserScore {
    displayName: string;
    highScore: number;
}

export default function Leaderboard() {
    const router = useRouter();
    const { user } = useUser();
    const [scores, setScores] = useState<UserScore[]>([]);
    const [myScore, setMyScore] = useState<number | null>(null);

    const handleGoBack =  () => {

        router.push("/game");
    };

    useEffect(() => {
        const fetchScores = async () => {
            const q = query(
                collection(db, "users"),
                orderBy("highScore", "desc"),
                limit(10)
            );
            const snapshot = await getDocs(q);
            const leaderboard: UserScore[] = [];
            snapshot.forEach((doc) => {
                leaderboard.push(doc.data() as UserScore);
            });
            setScores(leaderboard);

            // 내 최고 기록
            if (user) {
                const myDoc = leaderboard.find((s) => s.displayName === user.displayName);
                setMyScore(myDoc ? myDoc.highScore : 0);
            }
        };
        fetchScores();
    }, [user]);

    return (
        <div className="min-h-screen bg-beige-50 flex flex-col items-center p-6" style={{ backgroundColor: '#F5E1C8' }}>
            <h1 className="text-4xl font-semibold mb-6" style={{ color: '#8B5E3C' }}>브이브이 전당</h1>

            {myScore !== null ? (
                <div className="w-full max-w-md mb-6 p-4 rounded-2xl flex justify-between items-center shadow-md" style={{ backgroundColor: '#FFF3E0' }}>
                    <span className="font-medium" style={{ color: '#A67C52' }}>내 최고 기록</span>
                    <span className="text-xl font-bold" style={{ color: '#8B5E3C' }}>{myScore.toFixed(2)}초</span>
                </div>
            ):(
                <div className="w-full max-w-md mb-6 p-4 rounded-2xl flex justify-between items-center shadow-md" style={{ backgroundColor: '#FFF3E0' }}>
            <span className="font-medium" style={{ color: '#A67C52' }}>로그인을 하고 내 기록을 남기자!</span>
        </div>)}

            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-md" style={{ backgroundColor: '#FFF3E0' }}>
                <div className="px-4 py-3 font-medium text-lg" style={{ backgroundColor: '#EED9B2', color: '#8B5E3C' }}>
                    랭킹
                </div>
                <ul>
                    {scores.map((s, index) => (
                        <li
                            key={s.displayName}
                            className={`flex justify-between px-4 py-3 border-b last:border-b-0 transition-colors`}
                            style={{
                                backgroundColor: user?.displayName === s.displayName ? '#F5D7A1' : '#FFF3E0',
                                borderColor: '#E0C9A6',
                            }}
                        >
                            <span className="font-medium" style={{ color: '#8B5E3C' }}>
                                {index + 1}. {s.displayName}
                            </span>
                            <span className="font-semibold" style={{ color: '#8B5E3C' }}>
                                {(Math.round(s.highScore * 100) / 100).toFixed(2)}초
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={handleGoBack}
                className="mt-10 px-6 py-2 rounded hover:opacity-90 font-semibold hover:cursor-pointer"
                style={{
                    backgroundColor: '#A67C52',
                    color: 'white'
                }}
            >
               이전 화면으로
            </button>
        </div>
    );
}
