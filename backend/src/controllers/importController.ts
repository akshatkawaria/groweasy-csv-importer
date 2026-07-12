import { Request, Response } from "express";

export const handleImport = async (req: Request, res: Response) => {
  try {
    const { rows } = req.body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({
        error: "No rows provided. Expected { rows: [...] } in request body.",
      });
    }

    // STUB: just echo back rows as "imported" for now, no AI yet
    res.json({
      imported: rows,
      skipped: [],
      totalImported: rows.length,
      totalSkipped: 0,
    });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ error: "Internal server error during import." });
  }
};