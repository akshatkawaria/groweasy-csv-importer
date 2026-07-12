interface ResultTableProps {
  imported: any[];
  skipped: any[];
  totalImported: number;
  totalSkipped: number;
  onReset: () => void;
}

export default function ResultTable({
  imported,
  skipped,
  totalImported,
  totalSkipped,
  onReset,
}: ResultTableProps) {
  const headers =
    imported.length > 0
      ? Object.keys(imported[0])
      : [];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-700 dark:text-green-400">Total Imported</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">
            {totalImported}
          </p>
        </div>
        <div className="flex-1 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-700 dark:text-red-400">Total Skipped</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">{totalSkipped}</p>
        </div>
      </div>

      {imported.length > 0 && (
        <>
          <h3 className="font-semibold mb-2">Imported Records</h3>
          <div className="border rounded-lg overflow-hidden mb-6">
            <div className="max-h-96 overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                  <tr>
                    {headers.map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-left font-medium whitespace-nowrap border-b"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {imported.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                      {headers.map((h) => (
                        <td key={h} className="px-4 py-2 whitespace-nowrap">
                          {String(row[h] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {skipped.length > 0 && (
        <>
          <h3 className="font-semibold mb-2 text-red-600">Skipped Records</h3>
          <div className="border rounded-lg overflow-hidden mb-6">
            <div className="max-h-64 overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-red-50 dark:bg-red-950 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium border-b">Reason</th>
                    <th className="px-4 py-2 text-left font-medium border-b">Original Row</th>
                  </tr>
                </thead>
                <tbody>
                  {skipped.map((s, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-2">{s.reason}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">
                        {JSON.stringify(s.originalRow)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <button
        onClick={onReset}
        className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
      >
        Import Another File
      </button>
    </div>
  );
}