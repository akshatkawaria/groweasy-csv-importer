"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import PreviewTable from "@/components/PreviewTable";
import ResultTable from "@/components/ResultTable";

type Step = "upload" | "preview" | "result";

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    imported: any[];
    skipped: any[];
    totalImported: number;
    totalSkipped: number;
  } | null>(null);

  const handleParsed = (data: any[], name: string, size: number) => {
    setParsedData(data);
    setFileName(name);
    setFileSize(size);
    setStep("preview");
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
  `     ${process.env.NEXT_PUBLIC_API_URL}/api/import`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows: parsedData }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Import failed");
      }

      const data = await res.json();
      setResult(data);
      setStep("result");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setParsedData([]);
    setFileName("");
    setFileSize(0);
    setResult(null);
    setError("");
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">GrowEasy CSV Importer</h1>
        <p className="text-gray-500 mb-8">
          Upload any CSV — AI will map it to CRM format automatically.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {step === "upload" && <UploadZone onParsed={handleParsed} />}

        {step === "preview" && (
          <PreviewTable
            data={parsedData}
            fileName={fileName}
            fileSize={fileSize}
            onConfirm={handleConfirm}
            onCancel={handleReset}
            loading={loading}
          />
        )}

        {step === "result" && result && (
          <ResultTable
            imported={result.imported}
            skipped={result.skipped}
            totalImported={result.totalImported}
            totalSkipped={result.totalSkipped}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}