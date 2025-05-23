import React from "react";

const SpecificationTable = ({ data = [], title = "General" }) => {
  if (!data.length) return null;

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 transition-all hover:shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="odd:bg-gray-50 even:bg-white border-b border-gray-100 last:border-0">
                <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3">{item.value || "---"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecificationTable;
