import { Request, Response } from "express";
import { chunkArray } from "../utils/batching";
import { extractBatch } from "../services/aiExtractor";
import { CrmRecord } from "../types/crm";

export const handleImport = async (req: Request, res: Response) => {
  try {
    const { rows } = req.body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({
        error: "No rows provided. Expected { rows: [...] } in request body.",
      });
    }

    const batches = chunkArray(rows, 25);
    const imported: CrmRecord[] = [];
    const skipped: { reason: string; originalRow: any }[] = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      try {
        const extracted = await extractBatch(batch);
        imported.push(...extracted);
      } catch (err) {
        console.error(`Batch ${i + 1} failed:`, err);
        batch.forEach((row) => {
          skipped.push({ reason: "AI processing failed for this batch", originalRow: row });
        });
      }
    }

    res.json({
      imported,
      skipped,
      totalImported: imported.length,
      totalSkipped: skipped.length,
    });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ error: "Internal server error during import." });
  }
};  