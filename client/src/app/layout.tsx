import "@/styles/globals.css";

import type { ReactNode } from "react";
import ContextProvider from "@/context/ContextProvider";
import ToastProvider from "@/context/ToastContext";

export const metadata = {
  title: "chesser",
  description: "Play Chess online.",
  openGraph: {
    title: "chesser",
    description: "Play Chess online.",
    url: "https://ches.su",
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
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(process.env.VERCEL ? "https://ches.su" : "http://localhost:3000")
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <ContextProvider>
          {/* <main className="mx-1 flex justify-center md:mx-16 lg:mx-40"> */}
          <ToastProvider>{children}</ToastProvider>
          {/* </main> */}
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
