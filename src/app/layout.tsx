import "./globals.css";
import { ICONS } from "@/constants";
import MobileNav from "./components/MobileNav";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_TITLE,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
};

const appName = process.env.NEXT_PUBLIC_APP_NAME;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-green-700 text-white p-4 shadow-md relative">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <a href="/" className="text-xl sm:text-2xl font-bold">
              {ICONS.APP_LOGO} {appName}
            </a>
            <MobileNav />
          </div>
        </nav>
        <main className="max-w-7xl mx-auto p-4 sm:p-6">{children}</main>
      </body>
    </html>
  );
}
