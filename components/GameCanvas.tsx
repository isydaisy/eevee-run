"use client";

import React, { useRef, useEffect } from "react";
import {saveHighScore} from "@/firebase/saveHighScore";
import { useUser } from "@/context/UserContext";


interface GameCanvasProps {
    onTimeUpdate?: (seconds: number) => void;
    onGameOver?: (value: boolean) => void;

}

const GameCanvas: React.FC<GameCanvasProps> = ({ onTimeUpdate,onGameOver })   => {
    const { user } = useUser();
    const canvasRef = useRef<HTMLCanvasElement>(null);



    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let gameSpeed = 5;
        let isGameOver = false;
        const obstacles: { x: number; y: number; width: number; height: number }[] = [];
        let lastObstacleTime = 0;
        let nextObstacleDelay = 2000;

        let jumpRequested = false;

        const playerImages = [new Image(), new Image()];
        playerImages[0].src = "/eevee-dot1.png";
        playerImages[1].src = "/eevee-dot2.png";

        let currentFrame = 0;
        let frameTimer = 0;
        const frameInterval = 100; // 0.1초마다 이미지 변경

        const obstacleImage = new Image();
        obstacleImage.src = "/poke-ball.png";

        const player = { x: 0, y: 0, width: 0, height: 0, dy: 0, gravity: 0, jumpForce: 0, onGround: true };
        let groundY = 0;

        const resizeCanvas = () => {

            canvas.width = window.innerWidth * 0.9;
            canvas.height = window.innerHeight * 0.25;

            groundY = canvas.height - canvas.height * 0.2;

            // 플레이어 높이를 기준으로 폭 계산 (원본 비율 유지)
            const playerHeight = canvas.height * 0.2;
            const playerRatio = playerImages[0].width / playerImages[0].height || 1;
            player.height = canvas.height * 0.2;
            player.width = player.height * playerRatio;
            player.height = playerHeight;
            player.width = playerHeight * playerRatio;
            player.x = canvas.width * 0.05;
            player.y = groundY - player.height;
            player.dy = 0;
            player.gravity = 0.6 * (canvas.height / 200);
            player.jumpForce = -8 * (canvas.height / 200);
            player.onGround = true;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        type Rect = {
            x: number;
            y: number;
            width: number;
            height: number;
        };

        const isColliding = (a: Rect, b: Rect) =>
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;

        const handleKeyDown = (e: KeyboardEvent) => { if (e.code === "Space") jumpRequested = true; };
        const handleKeyUp = (e: KeyboardEvent) => { if (e.code === "Space") jumpRequested = false; };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        // 터치 점프
        canvas.addEventListener("touchstart", (e) => { e.preventDefault(); jumpRequested = true; });
        canvas.addEventListener("touchend", (e) => { e.preventDefault(); jumpRequested = false; });

        const startTime = performance.now();
        let lastTime = startTime;

        const gameLoop = (time: number) => {
            const deltaTime = time - lastTime;
            lastTime = time;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 배경
            ctx.fillStyle = "#72ed6b";
            ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

            // 점프 처리
            if (jumpRequested && player.onGround) {
                player.dy = player.jumpForce;
                player.onGround = false;
                jumpRequested = false;
            }

            // 플레이어 업데이트
            player.dy += player.gravity;
            player.y += player.dy;
            if (player.y + player.height >= groundY) {
                player.y = groundY - player.height;
                player.dy = 0;
                player.onGround = true;
            }
            frameTimer += deltaTime;
            if (frameTimer > frameInterval) {
                currentFrame = (currentFrame + 1) % playerImages.length;
                frameTimer = 0;
            }
            ctx.drawImage(playerImages[currentFrame], player.x, player.y, player.width, player.height);

            // 장애물 생성
            lastObstacleTime += deltaTime;

            if (lastObstacleTime > nextObstacleDelay) {
                const obsHeight = canvas.height * 0.1;
                const obsRatio = obstacleImage.width / obstacleImage.height || 1;
                obstacles.push({
                    x: canvas.width,
                    y: groundY - obsHeight,
                    width: obsHeight * obsRatio,
                    height: obsHeight,
                });

                lastObstacleTime = 0; // 시간 초기화

                // 랜덤 간격 수정: 0.5~3초 사이로 넓게 변경
                nextObstacleDelay = Math.random() * 1500 + 500;
            }

            // 장애물 이동 + 충돌 체크
            obstacles.forEach((obs) => {
                obs.x -= gameSpeed;
                ctx.drawImage(obstacleImage, obs.x, obs.y, obs.width, obs.height);

                const playerBox = { x: player.x + 5, y: player.y + 10, width: player.width - 10, height: player.height - 10 };
                const obstacleBox = { x: obs.x + 3, y: obs.y + 3, width: obs.width - 6, height: obs.height - 3 };

                if (!isGameOver && isColliding(playerBox, obstacleBox)) {
                    isGameOver = true;               // 캔버스 내부 상태 true
                }

            });



            gameSpeed += 0.005;



            const saveScoreAsync = async () => {
                if (!user) return; // 로그인 안 되어 있으면 저장하지 않음
                // console.log("@@@@")
                try {
                    await saveHighScore(user, elapsed); // user 객체 전체 전달
                    // console.log("점수 저장 완료:", elapsed);
                } catch (err) {
                    // console.error("점수 저장 실패:", err);
                }
            };


            // 시간 표시
            const elapsed = time - startTime;
            if (onTimeUpdate) {
                onTimeUpdate(elapsed);
            }

            if (!isGameOver) {
                requestAnimationFrame(gameLoop);
                if(onGameOver) onGameOver(false)
            }else{
                // 게임 종료 시 점수 저장

                if(onGameOver) onGameOver(true);
                saveScoreAsync();
                console.log("저장할 점수:", elapsed);

            }



        };

        let imagesLoaded = 0;
        [...playerImages, obstacleImage].forEach((img) => {
            img.onload = () => {
                imagesLoaded++;
                // 모든 플레이어 이미지 + 장애물 이미지가 로드되면 시작
                if (imagesLoaded === playerImages.length + 1) requestAnimationFrame(gameLoop);
            };
        });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("resize", resizeCanvas);
        };


    }, []);

    return (
        <div className="flex justify-center items-center h-full ">
            <canvas ref={canvasRef} className="" />

        </div>
    );
};

export default GameCanvas;
