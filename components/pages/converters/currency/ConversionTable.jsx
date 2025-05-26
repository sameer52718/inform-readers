import React from "react";

const ConversionTable = ({ conversionTable, metadata, amount, result }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 border-b pb-2">
          {metadata.from.code} to {metadata.to.code}
        </h3>
        <div className="overflow-hidden rounded-lg">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-red-100 to-red-50">
                <th className="p-3 font-semibold text-gray-700 border-b">{metadata.from.code}</th>
                <th className="p-3 font-semibold text-gray-700 border-b">{metadata.to.code}</th>
              </tr>
            </thead>
            <tbody>
              {conversionTable.map((row, index) => (
                <tr
                  key={row.amount}
                  className={`border-b hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3">
                    <span className="font-medium">{row.amount}</span> {metadata.from.code}
                  </td>
                  <td className="p-3">
                    <span className="font-medium">{row.converted}</span> {metadata.to.code}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 border-b pb-2">
          {metadata.to.code} to {metadata.from.code}
        </h3>
        <div className="overflow-hidden rounded-lg">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-red-100 to-red-50">
                <th className="p-3 font-semibold text-gray-700 border-b">{metadata.to.code}</th>
                <th className="p-3 font-semibold text-gray-700 border-b">{metadata.from.code}</th>
              </tr>
            </thead>
            <tbody>
              {conversionTable.map((row, index) => (
                <tr
                  key={row.amount}
                  className={`border-b hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3">
                    <span className="font-medium">{row.amount}</span> {metadata.to.code}
                  </td>
                  <td className="p-3">
                    <span className="font-medium">
                      {((row.amount * Number(amount)) / Number(result)).toFixed(6)}
                    </span>{" "}
                    {metadata.from.code}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConversionTable;
