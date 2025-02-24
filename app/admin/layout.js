// app/admin/layout.js
export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <ul>
          <li>
            <a href="/admin" className="block py-2">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/admin/settings" className="block py-2">
              Settings
            </a>
          </li>
        </ul>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
