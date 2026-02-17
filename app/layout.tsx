import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme-colors";
import { MenuProvider } from "@providers/MenuProvider";

import "./globals.css";
import "@mantine/core/styles.css";
import { ModalFeature } from "@/features/modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CTools",
  description: "Programas utilizables para Waldos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider theme={theme}>
          <MenuProvider>{children}</MenuProvider>
          <ModalFeature />
        </MantineProvider>
      </body>
    </html>
  );
}
