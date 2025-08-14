export default function DataTable({ headers, rows, className = '' }) {
  return (
    <div className={`bg-white border border-gray-300 rounded-sm overflow-hidden ${className}`}>
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-3 py-2 text-left font-medium text-gray-700 text-xs uppercase tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-1 text-gray-900">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}