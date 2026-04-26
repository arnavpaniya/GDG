import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  title: "Nyaya AI — Detect bias. Explain unfairness. Ship trustworthy AI.",
  description:
    "Nyaya AI is the immersive bias-detection platform. Score fairness 0–100, explain bias in plain English, compare models, and ship AI that stands up to scrutiny.",
  icons: {
    icon: "/assets/favicon.png",
    shortcut: "/assets/favicon.png",
    apple: "/assets/favicon.png",
  },
};

// Apply persisted theme before paint to avoid flash
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme') || 'dark';
    var root = document.documentElement;
    root.classList.remove('dark');
    root.removeAttribute('data-theme');
    if (t === 'system') {
      var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (d) root.classList.add('dark');
      root.setAttribute('data-theme', d ? 'dark' : 'light');
    } else if (t === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme','dark');
    } else {
      root.setAttribute('data-theme', t);
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary transition-colors duration-300">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
