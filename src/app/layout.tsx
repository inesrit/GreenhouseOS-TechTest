import "./globals.css";

export const metadata = {
  title: "GreenHouse Property Portal",
  description: "Property management portal",
};

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
              🏡 GreenhouseOS
            </a>
            <div className="flex gap-6 text-sm">
              <a href="/" className="hover:underline">Properties</a>
              <a href="#" className="hover:underline">Dashboard</a>
              <a href="#" className="hover:underline">Settings</a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
