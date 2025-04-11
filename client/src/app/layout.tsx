import "@/styles/globals.css";

import type { ReactNode } from "react";
import ContextProvider from "@/context/ContextProvider";
import ToastProvider from "@/context/ToastContext";

export const metadata = {
  description: "Play Chess online.",
  openGraph: {
    title: "chesser",
    description: "Play Chess online.",
    url: "https://chesser",
    siteName: "chesser",
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: false,
    nocache: true,
    noarchive: true
  },
  icons: {
    icon: [
      { type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
      { type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" }
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" }
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <ContextProvider>
          <ToastProvider>{children}</ToastProvider>
        </ContextProvider>
        <script
          id="load-theme"
          dangerouslySetInnerHTML={{
            __html: `if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
              document.documentElement.setAttribute("data-theme", "chessuDark");
          } else {
              document.documentElement.setAttribute("data-theme", "chessuLight");
          }`
          }}
        ></script>
      </body>
    </html>
  );
}
