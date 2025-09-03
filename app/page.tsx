import LoginButtons from "@/components/LoginButtons";

export default function Home() {
  return (
      <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">

          <img
              src={'/eevee_game.jpg'}
              alt=""
              className="w-fit h-56 object-cover"
          />
        <h1 className="text-xl font-bold my-8 ">로그인 하고 게임 시작하기</h1>
        <LoginButtons/>
      </div>
  );

}
