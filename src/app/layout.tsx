import "./globals.css";
import { UI_TEXT, ICONS } from "@/constants/constants";

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
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-green-700 text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <a href="/" className="text-2xl font-bold">
              {ICONS.APP_LOGO} {appName}
            </a>
            <div className="flex gap-6 text-sm">
              <a href="/" className="hover:underline">{UI_TEXT.NAV_PROPERTIES}</a>
              <a href="#" className="hover:underline">{UI_TEXT.NAV_DASHBOARD}</a>
              <a href="#" className="hover:underline">{UI_TEXT.NAV_SETTINGS}</a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
