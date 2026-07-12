# GrowEasy CSV Importer

An AI-powered CSV importer that intelligently extracts CRM lead information from any CSV format — regardless of column names, layout, or structure.

## Live Demo
- **Frontend**: https://groweasy-csv-importer-lemon-phi.vercel.app
- **Backend API**: https://groweasy-csv-importer-39en.onrender.com

> Note: Backend is on Render's free tier, which spins down after inactivity. The first request after idle time may take 30–50 seconds to respond.

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS, react-dropzone, PapaParse
- **Backend**: Node.js, Express, TypeScript
- **AI**: Groq (Llama 3.3 70B) for intelligent field mapping

## How It Works
1. User uploads any CSV (different column names/layouts supported)
2. Frontend parses and previews the raw data — no AI call yet
3. On confirmation, rows are sent to the backend in batches
4. Backend sends each batch to the AI with a detailed system prompt describing the CRM schema
5. AI maps ambiguous columns (e.g. "Ph No", "Contact Number") to the correct CRM fields
6. Backend validates AI output against allowed enum values before returning
7. Records without email or mobile are automatically skipped
8. Results (imported + skipped) are displayed with totals

## Local Setup

### Prerequisites
- Node.js v18+
- A Groq API key (free at https://console.groq.com/keys)

### Backend
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```
PORT=5000
GROQ_API_KEY=your_groq_key_here
```
```bash
npm run dev
```
Backend runs on `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
```
Create a `.env.local` file in `frontend/`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

## API

### `POST /api/import`
**Request body:**
```json
{ "rows": [{ "any": "csv", "row": "data" }] }
```
**Response:**
```json
{
  "imported": [...],
  "skipped": [...],
  "totalImported": 0,
  "totalSkipped": 0
}
```

## CRM Fields Extracted
`created_at`, `name`, `email`, `country_code`, `mobile_without_country_code`, `company`, `city`, `state`, `country`, `lead_owner`, `crm_status`, `crm_note`, `data_source`, `possession_time`, `description`

## Design Notes
- AI extraction uses a detailed system prompt with the full CRM schema, explicit enum constraints, and a worked example to guide accurate field mapping on messy/ambiguous columns.
- Rows are processed in batches of 25 to stay within reasonable AI context sizes and improve reliability.
- A validation layer checks AI-returned `crm_status` and `data_source` values against allowed enums, blanking out anything invalid rather than trusting AI output blindly.
- Rows with neither an email nor a mobile number are excluded per the spec, with reasons tracked and shown in the UI.