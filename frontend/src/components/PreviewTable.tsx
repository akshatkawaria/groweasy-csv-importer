interface PreviewTableProps {
  data: any[];
  fileName: string;
  fileSize: number;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function PreviewTable({
  data,
  fileName,
  fileSize,
  onConfirm,
  onCancel,
  loading,
}: PreviewTableProps) {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{fileName}</h2>
          <p className="text-sm text-gray-500">
            {(fileSize / 1024).toFixed(2)} KB · {data.length} rows
          </p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
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
              {data.map((row, i) => (
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

      <div className="flex gap-3 mt-4">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Processing with AI..." : "Confirm Import"}
        </button>
      </div>
    </div>
  );
}