import { useState } from "react";

export default function SizeGuide() {
  const [selectedSystem, setSelectedSystem] = useState("US");

  const sizeConversions = {
    US: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13],
    EU: [38, 39, 40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45, 46, 47, 47.5, 48],
    UK: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
  };

  const convertSize = (usSize, targetSystem) => {
    const index = sizeConversions.US.indexOf(usSize);
    if (index === -1) return "-";
    return sizeConversions[targetSystem][index];
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-8">
      <h3 className="text-2xl font-bold mb-4">Size Guide</h3>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Size System:</label>
        <div className="flex gap-2">
          {["US", "EU", "UK"].map((system) => (
            <button
              key={system}
              onClick={() => setSelectedSystem(system)}
              className={`px-6 py-2 border-2 rounded-lg font-medium transition-all ${
                selectedSystem === system
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                  : "bg-white dark:bg-black border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white"
              }`}
            >
              {system}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-700">
              <th className="p-3 text-left">US</th>
              <th className="p-3 text-left">EU</th>
              <th className="p-3 text-left">UK</th>
            </tr>
          </thead>
          <tbody>
            {sizeConversions.US.map((usSize) => (
              <tr
                key={usSize}
                className={`border-b border-gray-200 dark:border-gray-800 ${
                  selectedSystem === "US" && usSize === 10
                    ? "bg-gray-100 dark:bg-gray-900"
                    : ""
                }`}
              >
                <td className="p-3">{usSize}</td>
                <td className="p-3">{convertSize(usSize, "EU")}</td>
                <td className="p-3">{convertSize(usSize, "UK")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <h4 className="font-semibold mb-2">How to Measure:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Place your foot on a piece of paper</li>
          <li>Mark the longest point of your foot</li>
          <li>Measure from the heel to the longest toe</li>
          <li>Compare your measurement with the size chart</li>
          <li>Consider the "True to Size" ratings from customer reviews</li>
        </ol>
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h4 className="font-semibold mb-2">Fit Recommendations:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <strong>Runs Small:</strong> Consider ordering half a size larger
          </li>
          <li>
            <strong>True to Size:</strong> Order your regular size
          </li>
          <li>
            <strong>Runs Large:</strong> Consider ordering half a size smaller
          </li>
        </ul>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Check customer reviews for specific fit information on each product.
        </p>
      </div>
    </div>
  );
}

