import React from "react";
import { Table } from "lucide-react";

const ConversionTable = ({ metalTable, metalMetadata }) => {
  if (!metalTable.length || !metalMetadata) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <Table className="text-red-600 mr-2" size={24} />
            <h3 className="text-2xl font-bold text-gray-800">
              {metalMetadata.currency.code} to {metalMetadata.metal.fullName} Conversion Table
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-gray-700">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left font-semibold border-b border-gray-200 text-gray-600">
                    {metalMetadata.currency.code}
                  </th>
                  <th className="py-4 px-6 text-left font-semibold border-b border-gray-200 text-gray-600">
                    {metalMetadata.metal.fullName} ({metalMetadata.metal.unit})
                  </th>
                </tr>
              </thead>
              <tbody>
                {metalTable.map((row, index) => (
                  <tr
                    key={row.amount}
                    className={`border-b border-gray-100 hover:bg-red-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-6">
                      <span className="font-medium">{row.amount.toLocaleString()}</span>{" "}
                      {metalMetadata.currency.code}
                    </td>
                    <td className="py-3 px-6">
                      <span className="font-semibold text-red-700">{row.converted}</span>{" "}
                      {metalMetadata.metal.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Prices based on current market rates. Updated regularly.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConversionTable;
