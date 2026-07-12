"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";

interface UploadZoneProps {
  onParsed: (data: any[], fileName: string, fileSize: number) => void;
}

export default function UploadZone({ onParsed }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Max size is 5MB.");
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onParsed(results.data as any[], file.name, file.size);
        },
        error: (err) => {
          alert("Failed to parse CSV: " + err.message);
        },
      });
    },
    [onParsed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
          : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-lg font-medium">
          {isDragActive ? "Drop your CSV here" : "Drag & drop your CSV file here"}
        </p>
        <p className="text-sm text-gray-500">or click to browse files</p>
        <p className="text-xs text-gray-400 mt-2">Supported file: .csv (max 5MB)</p>
      </div>
    </div>
  );
}