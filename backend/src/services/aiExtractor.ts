import Groq from "groq-sdk";
import { ALLOWED_CRM_STATUS, ALLOWED_DATA_SOURCE } from "../types/crm";

let groq: Groq;
function getGroqClient(): Groq {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
  }
  return groq;
}

const SYSTEM_PROMPT = `You are a data extraction assistant for a CRM system called GrowEasy.

You will receive an array of raw CSV row objects. Each row may have different, inconsistent, or ambiguous column names (e.g. "Ph No", "Contact Number", "Mobile", "E-mail", "Email Id", "Full Name", "Client Name").

Your job: map each row into the following GrowEasy CRM schema, as accurately as possible.

CRM FIELDS:
- created_at: Lead creation date/time. Must be in a format parseable by JavaScript's "new Date(created_at)". If no date is present, leave blank.
- name: Lead's full name.
- email: Primary email address.
- country_code: Country code for mobile number (e.g. "+91"). Infer from context if possible, else leave blank.
- mobile_without_country_code: Mobile number WITHOUT the country code.
- company: Company name, if present.
- city: City.
- state: State.
- country: Country.
- lead_owner: Person/agent who owns this lead (often an email or name).
- crm_status: MUST be exactly one of: ${ALLOWED_CRM_STATUS.join(", ")}. If the row doesn't clearly indicate status, leave blank.
- crm_note: Any remarks, notes, follow-up comments, extra phone numbers, extra emails, or other info that doesn't fit elsewhere.
- data_source: MUST be exactly one of: ${ALLOWED_DATA_SOURCE.join(", ")}. If none match confidently, leave blank.
- possession_time: Property possession time, if mentioned (real estate context).
- description: Any additional descriptive info not captured elsewhere.

0. Each input row includes a "_rowIndex" field. Your output for each row (whether mapped or explicitly noting it was skipped) must preserve this "_rowIndex" so we can track which original row it came from. Include "_rowIndex" as a field in every output object.

RULES:
1. If a row has MULTIPLE emails, use the first one as "email" and append the rest into "crm_note".
2. If a row has MULTIPLE mobile numbers, use the first one as "mobile_without_country_code" and append the rest into "crm_note".
3. If a row has NEITHER an email NOR a mobile number, SKIP that row entirely (do not include it in output).
4. Never invent data that isn't present or reasonably inferable from the row.
5. crm_status and data_source must ONLY use the exact allowed values listed above, or be left as an empty string "" if uncertain. Never invent new values.
6. Output must be a JSON array of objects, one per valid row (skipped rows excluded).
7. Respond with ONLY the JSON array. No markdown code fences, no explanation, no extra text before or after.

EXAMPLE INPUT:
[
  { "Full Name": "Amit Kumar", "Ph No": "9876543210 / 9123456780", "Email Id": "amit@test.com", "City": "Pune", "Remarks": "Interested, call back tomorrow" }
]

EXAMPLE OUTPUT:
[
  {
    "created_at": "",
    "name": "Amit Kumar",
    "email": "amit@test.com",
    "country_code": "",
    "mobile_without_country_code": "9876543210",
    "company": "",
    "city": "Pune",
    "state": "",
    "country": "",
    "lead_owner": "",
    "crm_status": "",
    "crm_note": "Interested, call back tomorrow. Additional number: 9123456780",
    "data_source": "",
    "possession_time": "",
    "description": ""
  }
]`;

export async function extractBatch(rows: any[], retries = 2): Promise<any[]> {
  const indexedRows = rows.map((row, idx) => ({ ...row, _rowIndex: idx }));
  const userPrompt = `Here are the CSV rows to map:\n${JSON.stringify(indexedRows, null, 2)}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const completion = await getGroqClient().chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
      });

      const responseText = completion.choices[0]?.message?.content || "";
      const cleaned = responseText.replace(/```json|```/g, "").trim();

      return JSON.parse(cleaned);
    } catch (err) {
      const isLastAttempt = attempt === retries;
      console.error(`AI extraction attempt ${attempt + 1} failed:`, err);

      if (isLastAttempt) {
        throw err;
      }

      const delay = 1000 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("AI extraction failed after all retries");
}