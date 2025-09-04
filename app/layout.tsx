import type { Metadata } from "next";
import "./globals.css";

import { UserProvider } from "@/context/UserContext";

export const metadata: Metadata = {
    title: `EEVEE RUN!`,
    description: "mini game",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.png",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <UserProvider>{children}</UserProvider>
        </body>
        </html>
    );
}

