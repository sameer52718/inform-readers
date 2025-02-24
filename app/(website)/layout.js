// app/layout.js
export default function WebsiteLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-blue-500 text-white text-center">Website Header</header>
      <main className="flex-1">{children}</main>
      <footer className="p-4 bg-gray-800 text-white text-center">Website Footer</footer>
    </div>
  );
}
