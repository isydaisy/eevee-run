import { db } from "./firebase";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";

export async function saveHighScore(user: any, score: number) {
    if (!user) return;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", user.displayName));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        // 이미 존재하면 최고 점수만 업데이트
        const docRef = snapshot.docs[0].ref;
        const prevScore = snapshot.docs[0].data().highScore || 0;
        if (score > prevScore) {
            await setDoc(docRef, { displayName: user.displayName, highScore: score });
        }
    } else {
        // 새로 추가
        await setDoc(doc(usersRef), { displayName: user.displayName, highScore: score });
    }
}
