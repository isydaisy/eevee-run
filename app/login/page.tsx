import LoginButtons from "@/components/LoginButtons";

export default function LoginPage() {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-8">게임 시작하기</h1>
            <LoginButtons/>
        </div>
    );
}
